import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  // Получение текущего пользователя
  getCurrentUser: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          loan_sum: true
        }
      });
    }),

  // Обновление имени пользователя
  updateName: protectedProcedure
    .input(z.object({
      name: z.string().min(2, "Имя должно содержать минимум 2 символа")
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name
        },
        select: {
          id: true,
          name: true,
        }
      });
    }),
});