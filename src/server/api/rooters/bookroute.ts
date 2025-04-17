import { z } from 'zod';
import { db } from '~/server/db';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';



export const bookSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  year: z.number().nullable(),
  description: z.string().nullable(),
  isbn: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});



export const BookRouter = createTRPCRouter({

  
  
  create: protectedProcedure
  .input(
    z.object({
      title: z.string().min(1),
      author: z.string().min(1),
      year: z.number().int(),
      description: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const book = await ctx.db.book.create({
      data: {
        title: input.title,
        author: input.author,
        year: input.year,
        description: input.description,
      },
    });
    return book;
  }),

  
    delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Удаляем все выдачи, связанные с книгой
      await db.loan.deleteMany({
        where: { bookId: input.id },
      });
      // Проверка роли LIBRARIAN
      // if (ctx.session.user.role !== 'LIBRARIAN') {
      //   throw new Error('Unauthorized');
      // }

       // Теперь можно удалить книгу
    await db.book.delete({
      where: { id: input.id },
    });

    return { success: true };
  }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string(),
      author: z.string(),
      year: z.number().nullable(),
      description: z.string().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Проверка роли LIBRARIAN
      // if (ctx.session.user.role !== 'LIBRARIAN') {
      //   throw new Error('Unauthorized');
      // }

      return await db.book.update({
        where: { id: input.id },
        data: {
          title: input.title,
          author: input.author,
          year: input.year,
          description: input.description,
        },
      });
    }),

    getAll: publicProcedure
    .input(
      z.object({
        title: z.string().optional(),
        author: z.string().optional(),
        year: z.number().optional(),
      }).optional()
    )
    .output(bookSchema.array())
    .query(async ({ input }) => {
      return await db.book.findMany({
        where: {
          title: input?.title ? { contains: input.title, mode: 'insensitive' } : undefined,
          author: input?.author ? { contains: input.author, mode: 'insensitive' } : undefined,
          year: input?.year ? { equals: input.year } : undefined,
        },
        select: {
          id: true,
          title: true,
          author: true,
          year: true,
          description: true,
          isbn: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),


  // Получение книги по ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .output(bookSchema.nullable())
    .query(async ({ input }) => {
      return await db.book.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          title: true,
          author: true,
          year: true,
          description: true,
          isbn: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),


});
