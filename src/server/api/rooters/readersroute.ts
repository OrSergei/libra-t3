// ~/server/api/routers/user.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const readerRouter = createTRPCRouter({
  // Получение всех пользователей с их долгами (активными займами)
  getUsersWithDebts: protectedProcedure
    .query(async ({ ctx }) => {
      // Проверка прав доступа (только для библиотекарей)
    //   if (ctx.session.user.role !== 'LIBRARIAN') {
    //     throw new Error('Доступно только для библиотекарей');
    //   }

      const users = await ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          loans: {
            where: {
              status: 'ACTIVE',
              dueDate: {
                lt: new Date() // Просроченные займы (дата возврата меньше текущей)
              }
            },
            select: {
              id: true,
              book: {
                select: {
                  id: true,
                  title: true,
                  author: true
                }
              },
              dueDate: true,
              loanDate: true
            },
            orderBy: {
              dueDate: 'asc' // Сортировка по сроку возврата (ближайшие сначала)
            }
          },
          _count: {
            select: {
              loans: {
                where: {
                  status: 'ACTIVE'
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return users.map(user => ({
        ...user,
        totalDebts: user.loans.length,
        totalActiveLoans: user._count.loans
      }));
    }),

    updateReader: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedUser = await ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });

      return {
        success: true,
        message: 'Данные читателя обновлены',
        user: updatedUser
      };
    }),
});