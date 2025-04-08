'use client';

type Book = {
  id: number;
  title: string;
  author: string;
  year?: number | null; // Делаем опциональным
  description?: string | null;
};

export function BookCard({ book }: { book: Book }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <h4 className="text-lg font-bold text-gray-900 mb-2">{book.title}</h4>
      <p className="text-gray-700">Автор: {book.author}</p>
      {book.year && <p className="text-gray-700">Год: {book.year}</p>}
      {book.description && (
        <p className="mt-2 text-gray-600">{book.description}</p>
      )}
      <button
        className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        onClick={() => alert(`Книга "${book.title}" добавлена`)}
      >
        Добавить книгу
      </button>
    </div>
  );
}