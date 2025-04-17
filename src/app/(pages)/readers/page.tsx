import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
// import { getUsers } from "~/server/users/users";
import {ReadsShow} from "~/app/componets/ReadersShow"

export default async function ReadersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }


  // const isLibrarian = session.user.role === "LIBRARIAN";
  // const users = await getUsers();

  return (
    <div className="min-h-screen bg-gray-100">

     

      {/* Основное содержимое */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-gray-900">Читатели</h3>

        <ReadsShow/>

      </main>
    </div>
  );
}
