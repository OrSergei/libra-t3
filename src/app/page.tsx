import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/profile");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">

        <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-2xl bg-gray-800/50 p-8 shadow-2xl backdrop-blur-md">

          <div className="mb-8 flex justify-center">
            <div className="rounded-lg bg-indigo-600 p-4">
              <BookIcon className="h-10 w-10 text-white" />
            </div>
          </div>

    
          <h1 className="mb-2 text-center text-3xl font-bold">
            Добро пожаловать в <span className="text-indigo-400">БиблиоТека</span>
          </h1>
          
   
          <div className="space-y-4">
            <Link
              href="/api/auth/signin?callbackUrl=/profile"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <UserIcon className="h-5 w-5" />
              Войти в аккаунт
            </Link>

          </div>
        </div>

       
      </div>
    </main>
  );
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
    
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}
