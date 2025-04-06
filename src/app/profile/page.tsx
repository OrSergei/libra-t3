import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Шапка */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Библиотечная система
            </h1>
               {/* Навигация */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <Link
            href="/books"
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
          >
            <h3 className="text-lg font-medium text-gray-900">Книги</h3>
            {/* <p className="mt-2 text-gray-600">
              Просмотр и управление каталогом книг
            </p> */}
          </Link>

          <Link
            href="/readers"
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
          >
            <h3 className="text-lg font-medium text-gray-900">Читатели</h3>
           
          </Link>

          <Link
            href="/loans"
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
          >
            <h3 className="text-lg font-medium text-gray-900">Выдачи</h3>
            {/* <p className="mt-2 text-gray-600">
              Учет выданных книг и контроль сроков
            </p> */}
          </Link>

          {/* <Link
            href="/profile"
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
          >
            <h3 className="text-lg font-medium text-gray-900">Профиль</h3>
            
          </Link> */}

         
        </div>
            <Link
              href="/api/auth/signout?callbackUrl=/"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Выйти
            </Link>
            
          </div>
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Блок с информацией о пользователе */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-800">
              <span className="text-xl font-medium">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {session.user.name}
              </h2>
              <p className="text-gray-600">Почта: {session.user.email} </p>
            </div>
          </div>
        </div>

     

        {/* Дополнительная информация */}
        <div className="mt-8 rounded-lg bg-indigo-50 p-6">
          <h3 className="text-lg font-medium text-indigo-800">
            Действия
          </h3>
          <div className="mt-4 flex space-x-4">
            <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Добавить книгу
            </button>
          
          </div>
        </div>
      </main>
    </div>
  );
}