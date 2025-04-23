import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { PaidUser } from "~/app/componets/PaidUser";
import { UserRole } from "@prisma/client";


export default async function ReadersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role != UserRole.LIBRARIAN) {
    return <div>Тебя тут не должно быть, сучара</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Шапка */}

      {/* Основное содержимое */}
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
            <h3 className="text-2xl font-bold text-gray-900">Выдача</h3>
            

            <PaidUser/>

      </main>
    </div>
  );
}