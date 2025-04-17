
// import { Session } from "next-auth";
import type { Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }){
    return (
        <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Библиотечная система
            </h1>
      
            <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full md:w-auto">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold">
                  {/* {isLibrarian ? "Зашел библиотекарь" : "Зашел пользователь"} */}
                </h2>
              </div>
      
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/profile"
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                >
                  <h3 className="text-lg font-medium text-gray-900">Профиль</h3>
                </Link>

                <Link
                href="/books"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
              >
                <h3 className="text-lg font-medium text-gray-900">Книги</h3>
              </Link>
              
                {/* {isLibrarian && ( */}
                  <Link
                    href="/readers"
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                  >
                    <h3 className="text-lg font-medium text-gray-900">Читатели</h3>
                  </Link>
                {/* )}
                {isLibrarian && ( */}
                  <Link
                    href="/loans"
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                  >
                    <h3 className="text-lg font-medium text-gray-900">Выдачи</h3>
                  </Link>
                {/* )} */}
              </div>
            </div>
      
            <Link
              href="/api/auth/signout?callbackUrl=/"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Выйти
            </Link>
          </div>
        </div>
      </div>
    )
}