import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/profile");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Авторизация</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <Link
          href="/api/auth/signin?callbackUrl=/profile"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Войти
        </Link>
      </div>
    </main>
  );
}
