import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import SignInForm from "./componets/SignInForm";
// import SignInForm from "./components/SignInForm";

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
            </div>
          </div>

          <h1 className="mb-6 text-center text-3xl font-bold">
            Добро пожаловать в <span className="text-indigo-400">БиблиоТека</span>
          </h1>

          <SignInForm />
        </div>
      </div>
    </main>
  );
}
