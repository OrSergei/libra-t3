import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";


export default async function BooksPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Книги</h1>
      <p className="mt-4 text-xl">Здесь будет интерфейс для работы с книгами 📚</p>
      <div className="flex flex-col items-center justify-center gap-4">
      <Link
          href="/api/auth/signout?callbackUrl=/"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Выйти
        </Link>
      </div>
    </main>
  );
}