import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const activeLoans = await db.loan.count({
    where: { 
      bookId: Number(params.id),
      status: 'ACTIVE',
    },
  });
  return NextResponse.json({ available: activeLoans === 0 });
}