import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const loanRouter = createTRPCRouter({

  create: protectedProcedure
    .input(
      z.object({
        id: z.number(), // Ищем книгу по ID
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Проверяем существование книги
      const existingBook = await ctx.db.book.findUnique({
        where: { id: input.id },
      });
  
      if (!existingBook) {
        throw new Error('Книга с указанным ID не найдена');
      }
  



      // Проверяем активные займы текущего пользователя для этой книги
    const userActiveLoan = await ctx.db.loan.findFirst({
      where: {
        bookId: input.id,
        userId: ctx.session.user.id,
        status: 'ACTIVE', // Проверяем только активные займы
      },
    });

    if (userActiveLoan) {
      throw new Error(`Вы уже взяли эту книгу. Верните её до ${userActiveLoan.dueDate.toLocaleDateString()}`);
    }

    // Проверяем, не выдана ли книга вообще кому-либо
    const bookActiveLoan = await ctx.db.loan.findFirst({
      where: {
        bookId: input.id,
        status: 'ACTIVE',
      },
    });

    if (bookActiveLoan) {
      throw new Error('Эта книга уже выдана другому пользователю');
    }


    
     
      // Создаем запись о выдаче
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // +14 дней на возврат
  
      const loan = await ctx.db.loan.create({
        data: {
          bookId: input.id,
          userId: ctx.session.user.id,
          dueDate: dueDate,
          status: 'ACTIVE',
        },
      });
  
      return {
        success: true,
        message: `Книга "${existingBook.title}" успешно выдана вам до ${dueDate.toLocaleDateString()}`,
        dueDate: dueDate,
      };
    }),

  getUserLoans: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.loan.findMany({
        where: { 
          userId: ctx.session.user.id,
          status: "ACTIVE"
        },
        include: {
          book: true
        },
        orderBy: {
          dueDate: "asc"
        }
      });
    }),

  returnBook: protectedProcedure
    .input(z.object({ loanId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.loan.update({
        where: { id: input.loanId },
        data: { 
          status: "RETURNED",
        }
      });
      return { success: true };
    }),
});