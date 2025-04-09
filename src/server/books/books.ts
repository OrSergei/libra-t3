// ~/server/books/books.ts
// import { prisma } from "~/server/db"; // импортируем подключение к базе данных

import { db } from "../db";

export async function getBooks() {
  return await db.book.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      year: true,
      description: true,
      isbn: true,
    },
  });
}

