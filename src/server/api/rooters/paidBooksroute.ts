// src/server/api/routers/user.ts
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import type { PenaltyStatus } from "@prisma/client";

export const paidUserRouter = createTRPCRouter({
  getPaidAndDebtorUsers: publicProcedure.query(async ({ ctx }) => {
    const loans = await ctx.db.loan.findMany({
      where: {
        penaltyStatus: {
          in: ["ACTIVE", "PAID"],
        },
      },
      include: {
        user: true,
        book: true,
      },
    });

    const grouped = loans.reduce<Record<string, {
      userId: string;
      name: string;
      loan_sum: number;
      loans: {
        bookTitle: string;
        loanDate: Date;
        dueDate: Date;
        penaltyStatus: string;
      }[];
    }>>((acc, loan) => {
      const userId = loan.userId;

      if (!acc[userId]) {
        acc[userId] = {
          userId,
          name: loan.user.name ?? "Без имени",
          loan_sum: loan.user.loan_sum,
          loans: [],
        };
      }

      acc[userId].loans.push({
        bookTitle: loan.book.title,
        loanDate: loan.loanDate,
        dueDate: loan.dueDate,
        penaltyStatus: loan.penaltyStatus,
      });

      return acc;
    }, {});

    return Object.values(grouped);
  }),
});
