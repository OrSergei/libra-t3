import { LoanStatus, PenaltyStatus } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const fineAmount = process.env.LOAN_PRICE ? +(process.env.LOAN_PRICE) : 200  


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

    // // Проверяем, не выдана ли книга вообще кому-либо
    // const bookActiveLoan = await ctx.db.loan.findFirst({
    //   where: {
    //     bookId: input.id,
    //     status: 'ACTIVE',
    //   },
    // });

    // if (bookActiveLoan) {
    //   throw new Error('Эта книга уже выдана другому пользователю');
    // }

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
      // 1. Получаем займ
      const loan = await ctx.db.loan.findUnique({
        where: { id: input.loanId },
        select: {
          dueDate: true,
          status: true,
          userId: true,
        }
      });
  
      if (!loan) throw new Error('Книжный долг не найден');
      if (loan.status === 'RETURNED') throw new Error('Книга уже возвращена');
  
      const isOverdue = loan.dueDate < new Date();
  
      // 2. Обновляем запись займа
      const updatedLoan = await ctx.db.loan.update({
        where: { id: input.loanId },
        data: {
          status: 'RETURNED',
          penaltyStatus: isOverdue ? 'ACTIVE' : 'NO_FINE',
        },
        include: {
          book: true,
          user: true
        }
      });
  
      if (isOverdue) {
        // 3. Если просрочено — начисляем штраф пользователю
        if (isOverdue) {
    
          await ctx.db.user.update({
            where: { id: loan.userId },
            data: {
              loan_sum: {
                increment: fineAmount
              }
            }
          });
        }
      }
  
      return {
        success: true,
        isOverdue,
        message: isOverdue
          ? 'Книга возвращена с опозданием. Начислен штраф.'
          : 'Книга успешно возвращена'
      };
    }),
  

  payDebt: protectedProcedure
  .mutation(async ({ input, ctx }) => {
    // Получаем сессию пользователя
    const session = ctx.session;

    // Проверяем, авторизован ли пользователь
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Находим пользователя по его ID
    const user = await ctx.db.user.findUnique({
      where: { id: session?.user?.id }
    });

    // Если пользователь не найден, возвращаем ошибку
    if (!user) {
      throw new Error("User not found");
    }

    // Проверяем, есть ли у пользователя задолженность
    if (user.loan_sum === 0) {
      throw new Error("Debt is already paid");
    }

    // Обновляем штрафы, если они активны
    const penaltyUpdate = await ctx.db.loan.updateMany({
      where: {
        userId: session?.user?.id,
        penaltyStatus: 'ACTIVE',
      },
      data: {
        penaltyStatus: 'PAID',
      },
    });

    // Если не удалось обновить штрафы, возвращаем ошибку
    if (penaltyUpdate.count === 0) {
      throw new Error("Failed to pay penalties");
    }

    // Обновляем сумму долга на 0
    const updatedUser = await ctx.db.user.update({
      where: { id: session?.user?.id },
      data: {
        loan_sum: 0,
      },
    });

    // Возвращаем обновленные данные пользователя
    return updatedUser;
  })
});
