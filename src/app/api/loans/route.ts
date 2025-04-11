import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { auth } from '~/server/auth';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { bookId } = await request.json();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // +14 дней на возврат

    await db.loan.create({
      data: {
        bookId: Number(bookId),
        userId: session.user.id,
        dueDate,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при выдаче книги' },
      { status: 500 }
    );
  }
}