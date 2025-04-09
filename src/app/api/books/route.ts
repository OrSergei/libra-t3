import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { auth } from '~/server/auth';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'LIBRARIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const book = await db.book.create({
      data: {
        title: data.title,
        author: data.author,
        year: Number(data.year),
        description: data.description || null,
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