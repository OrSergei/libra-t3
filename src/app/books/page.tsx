import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { getBooks } from "~/server/books/books"; 
import { AddBookForm } from "./components/AddBookForm";
import { BookCard } from "~/app/components/BookCard";

export default async function BooksPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const searchTerm = searchParams?.q || '';
  const session = await auth();
  if (!session) redirect('/');

  const isLibrarian = session.user.role === "LIBRARIAN";
  const allBooks = await getBooks();


  const filteredBooks = allBooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.year && book.year === parseInt(searchTerm, 10))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Библиотечная система
            </h1>

            <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full md:w-auto">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold">
                  {isLibrarian ? "Зашел библиотекарь" : "Зашел пользователь"}
                </h2>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/profile"
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                >
                  <h3 className="text-lg font-medium text-gray-900">Профиль</h3>
                </Link>

                {isLibrarian && (
                  <Link
                    href="/readers"
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                  >
                    <h3 className="text-lg font-medium text-gray-900">Читатели</h3>
                  </Link>
                )}
                {isLibrarian && (
                  <Link
                    href="/loans"
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                  >
                    <h3 className="text-lg font-medium text-gray-900">Выдачи</h3>
                  </Link>
                )}
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
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Книги</h3>

          <form action="/books" method="GET" className="relative w-64">
            <input
              type="text"
              name="q"
              placeholder="Поиск по книгам..."
              defaultValue={searchTerm}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              🔍
            </button>
          </form>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} isLibrarian={isLibrarian} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {searchTerm ? 'Ничего не найдено' : 'Книги не найдены'}
          </p>
        )}
        
        {isLibrarian && <AddBookForm />}
      </main>
    </div>
  );
}