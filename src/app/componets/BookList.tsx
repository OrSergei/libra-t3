'use client';
import { useSearchParams } from "next/navigation";
import { BookCard } from "~/app/componets/BookCard";
import { api } from "~/trpc/react";
import { AddBookForm } from "./AddBookForm";
import { useEffect } from "react";

export function BookList() {
  const searchParams = useSearchParams();

  const title = searchParams.get("title") || undefined;
  const author = searchParams.get("author") || undefined;
  const yearParam = searchParams.get("year");
  const year = yearParam ? parseInt(yearParam) : undefined;

  const { data: allBooks = [], refetch } = api.book.getAll.useQuery({
    
    title,
    author,
    year,
  });


// вызывает обновление данных
  // useEffect(()=>
  // {
  //   refetch()
  // }
  // ,[]
  // )





  return (
    
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Книги</h3>

          
          
          <form action="/books" method="GET" className="flex gap-2 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">Название</label>
              <input
                type="text"
                name="title"
                defaultValue={title}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Автор</label>
              <input
                type="text"
                name="author"
                defaultValue={author}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Год</label>
              <input
                type="number"
                name="year"
                defaultValue={year || ''}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔍 Поиск
            </button>
            
          </form>
        </div>
        <AddBookForm
          refetch={refetch}/>

        {allBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allBooks.map((book) => (
              <BookCard key={book.id} book={book} refetch={refetch} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Книга не найдена</p>
        )}
      </main>
    </div>
  );
}
