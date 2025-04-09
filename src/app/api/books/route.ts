// src/app/api/books/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { auth } from '~/server/auth';

// GET все книги
export async function GET() {
  try {
    const books = await db.book.findMany();
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST добавить книгу (только для библиотекарей)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'LIBRARIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const book = await db.book.create({
      data: {
        title: body.title,
        author: body.author,
        year: Number(body.year),
        description: body.description || null,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    );
  }
}