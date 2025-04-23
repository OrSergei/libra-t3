import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json(null, { status: 401 });

  const user = await db.user.findUnique({ where: { id: params.userId } });
  if (!user) return NextResponse.json(null, { status: 404 });

  if (user.loan_sum == 0) {
    return NextResponse.json({ message: "Долг уже оплачен." }, { status: 400 });
  }

  const result = await db.loan.updateMany({
    where: {
      userId: params.userId,        
      penaltyStatus: 'ACTIVE',
    },
    data: {
      penaltyStatus: 'PAID',
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ message: "Не удалось оплатить штрафы" }, { status: 304 });
  }

  const updatedDebt = await db.user.update({
    where: { id: params.userId },
    data: {
      loan_sum: 0,
    },
  });

  return NextResponse.json(updatedDebt, { status: 200 });
}