// src/components/BookCard.tsx
'use client';

import { useRouter } from 'next/navigation';

type Book = {
  id: number;
  title: string;
  author: string;
  year?: number | null;
  description?: string | null;
};

export function BookCard({ book, isLibrarian }: { book: Book; isLibrarian: boolean }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Удалить "${book.title}"?`)) return;
    
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Ошибка удаления');
      router.refresh(); // Обновляем список
    } catch (error) {
      console.error(error);
      alert('Не удалось удалить книгу');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all relative">
      {isLibrarian && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          title="Удалить книгу"
        >
          🗑️
        </button>
      )}
      
      <h4 className="text-lg font-bold text-gray-900 mb-2">{book.title}</h4>
      <p className="text-gray-700">Автор: {book.author}</p>
      {book.year && <p className="text-gray-700">Год: {book.year}</p>}
      {book.description && (
        <p className="mt-2 text-gray-600">{book.description}</p>
      )}
    </div>
  );
}