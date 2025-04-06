import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";

export default async function Profile() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Главная страница</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-2xl">{session.user.name}</p>
        <Link
          href="/api/auth/signout?callbackUrl=/"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Выйти
        </Link>
        <div className="flex flex-col gap-3 mt-6">
        <Link href="/books" className="text-lg underline hover:text-blue-400">Книги</Link>
        <Link href="/readers" className="text-lg underline hover:text-blue-400">Читатели</Link>
        <Link href="/loans" className="text-lg underline hover:text-blue-400">Выдачи</Link>
        {/* <Link href="/profile" className="text-lg underline hover:text-blue-400">Профиль</Link> */}
      </div>
      </div>
    </main>
  );
}
