
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { auth } from '~/server/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'LIBRARIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.book.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'LIBRARIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const updatedBook = await db.book.update({
      where: { id: Number(params.id) },
      data: {
        title: body.title,
        author: body.author,
        year: body.year ? Number(body.year) : null,
        description: body.description
      }
    });
    
    return NextResponse.json(updatedBook);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}