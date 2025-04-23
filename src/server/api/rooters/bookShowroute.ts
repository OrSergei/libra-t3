
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const showRouter = createTRPCRouter({
  // Получение списка всех читателей с их активными займами
  getReadersWithActiveLoans: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(), // Поиск по имени или email читателя
        showOnlyOverdue: z.boolean().optional(), // Только просроченные
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(), // Для пагинации
      })
    )
    .query(async ({ input, ctx }) => {
    //   if (ctx.session.user.role !== 'LIBRARIAN') {
    //     throw new Error('Доступно только для библиотекарей');
    //   }

      const { search, showOnlyOverdue, limit, cursor } = input;

      const readers = await ctx.db.user.findMany({
        where: {
          role: 'USER', // Только обычные читатели
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }),
          loans: {
            some: {
              status: 'ACTIVE',
              ...(showOnlyOverdue && { dueDate: { lt: new Date() } }),
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          loans: {
            where: {
              status: 'ACTIVE',
              ...(showOnlyOverdue && { dueDate: { lt: new Date() } }),
            },
            select: {
              id: true,
              loanDate: true,
              dueDate: true,
              book: {
                select: {
                  id: true,
                  title: true,
                  author: true,
                },
              },
            },
            orderBy: { dueDate: 'asc' },
            take: limit + 1, // Для пагинации
          },
          _count: {
            select: {
              loans: {
                where: { status: 'ACTIVE' },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (readers.length > limit) {
        const nextItem = readers.pop();
        nextCursor = nextItem?.id;
      }

      return {
        readers: readers.map(reader => ({
          ...reader,
          totalLoans: reader._count.loans,
        })),
        nextCursor,
      };
    }),

  // Получение детальной информации по конкретному читателю
  getReaderLoans: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const reader = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          loans: {
            where: { status: 'ACTIVE' },
            select: {
              id: true,
              loanDate: true,
              dueDate: true,
              status: true,
              book: {
                select: {
                  id: true,
                  title: true,
                  author: true,
                  year: true,
                },
              },
            },
            orderBy: { dueDate: 'asc' },
          },
          _count: {
            select: {
              loans: {
                where: { status: 'ACTIVE' },
              },
            },
          },
        },
      });

      if (!reader) {
        throw new Error('Читатель не найден');
      }

      return {
        ...reader,
        loans: reader.loans.map(loan => ({
          ...loan,
          isOverdue: loan.dueDate < new Date(),
        })),
      };
    }),
});