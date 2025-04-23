// ~/server/api/routers/review.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const reviewRouter = createTRPCRouter({
  // Создание нового отзыва
  createReview: protectedProcedure
    .input(
      z.object({
        bookId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Проверяем, брал ли пользователь эту книгу
      const hasBorrowed = await ctx.db.loan.findFirst({
        where: {
          bookId: input.bookId,
          userId: ctx.session.user.id,
          status: 'RETURNED',
        },
      });

      if (!hasBorrowed) {
        throw new Error('Вы можете оставить отзыв только на книги, которые вы брали и вернули');
      }

      // Проверяем, не оставлял ли уже пользователь отзыв на эту книгу
      const existingReview = await ctx.db.review.findFirst({
        where: {
          bookId: input.bookId,
          userId: ctx.session.user.id,
        },
      });

      if (existingReview) {
        throw new Error('Вы уже оставляли отзыв на эту книгу');
      }

      const review = await ctx.db.review.create({
        data: {
          bookId: input.bookId,
          userId: ctx.session.user.id,
          rating: input.rating,
          comment: input.comment,
        },
      });

      return {
        success: true,
        message: 'Отзыв успешно добавлен',
        review,
      };
    }),

  // Получение отзывов для книги
   getBookReviews : publicProcedure
  .input(z.object({ bookId: z.number() }))
  .query(async ({ input, ctx }) => {
    const reviews = await ctx.db.review.findMany({
      where: { bookId: input.bookId },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  }),

  
//   // Получение отзывов текущего пользователя
//   getUserReviews: protectedProcedure
//     .query(async ({ ctx }) => {
//       return await ctx.db.review.findMany({
//         where: { userId: ctx.session.user.id },
//         select: {
//           id: true,
//           rating: true,
//           comment: true,
//           createdAt: true,
//           book: {
//             select: {
//               id: true,
//               title: true,
//               author: true,
//             },
//           },
//         },
//         orderBy: { createdAt: 'desc' },
//       });
//     }),

//   // Обновление отзыва
//   updateReview: protectedProcedure
//     .input(
//       z.object({
//         reviewId: z.number(),
//         rating: z.number().min(1).max(5).optional(),
//         comment: z.string().optional(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       // Проверяем, принадлежит ли отзыв текущему пользователю
//       const review = await ctx.db.review.findUnique({
//         where: { id: input.reviewId },
//       });

//       if (!review) {
//         throw new Error('Отзыв не найден');
//       }

//       if (review.userId !== ctx.session.user.id) {
//         throw new Error('Вы можете редактировать только свои отзывы');
//       }

//       const updatedReview = await ctx.db.review.update({
//         where: { id: input.reviewId },
//         data: {
//           rating: input.rating,
//           comment: input.comment,
//         },
//       });

//       return {
//         success: true,
//         message: 'Отзыв успешно обновлен',
//         review: updatedReview,
//       };
//     }),

//   // Удаление отзыва
  deleteReview: protectedProcedure
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Проверяем, принадлежит ли отзыв текущему пользователю
      const review = await ctx.db.review.findUnique({
        where: { id: input.reviewId },
      });

      if (!review) {
        throw new Error('Отзыв не найден');
      }

      if (review.userId !== ctx.session.user.id && ctx.session.user.role !== 'LIBRARIAN') {
        throw new Error('Вы можете удалять только свои отзывы');
      }

      await ctx.db.review.delete({
        where: { id: input.reviewId },
      });

      return {
        success: true,
        message: 'Отзыв успешно удален',
      };
    }),


 adminDeleteReview :protectedProcedure
  .input(z.object({ reviewId: z.number() }))
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.role !== 'LIBRARIAN') {
      throw new Error('Доступ запрещён: только библиотекарь может выполнять это действие');
    }

    const review = await ctx.db.review.findUnique({
      where: { id: input.reviewId },
    });

    if (!review) {
      throw new Error('Отзыв не найден');
    }

    await ctx.db.review.delete({
      where: { id: input.reviewId },
    });

    return {
      success: true,
      message: 'Отзыв успешно удалён библиотекарем',
    };
  })
});