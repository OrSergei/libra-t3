'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Book = {
  id: number;
  title: string;
  author: string;
  year?: number | null;
  description?: string | null;
};

export function BookCard({ book, isLibrarian }: { book: Book; isLibrarian: boolean }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    year: book.year?.toString() || '',
    description: book.description || ''
  });

  // Удаление книги
  const handleDelete = async () => {
    if (!confirm(`Удалить "${book.title}"?`)) return;
    try {
      await fetch(`/api/books/${book.id}`, { method: 'DELETE' });
      router.refresh();
    } catch (error) {
      alert('Не удалось удалить книгу');
    }
  };

  // Редактирование книги
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          year: formData.year ? parseInt(formData.year) : null,
          description: formData.description
        })
      });
      
      if (!response.ok) throw new Error();
      
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      alert('Не удалось обновить книгу');
    }
  };

  // Взять книгу
  const handleBorrow = async () => {
    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id }),
      });
      if (!response.ok) throw new Error();
      alert('Книга добавлена в ваш профиль!');
      router.refresh();
    } catch (error) {
      alert('Не удалось взять книгу');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all relative">
      {isLibrarian && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-500 hover:text-blue-700"
            title={isEditing ? "Отменить редактирование" : "Редактировать книгу"}
          >
            {isEditing ? '❌' : '✏️'}
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
            title="Удалить книгу"
          >
            🗑️
          </button>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            className="w-full border p-2 rounded"
            placeholder="Год издания"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border p-2 rounded"
            placeholder="Описание"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Сохранить
          </button>
        </form>
      ) : (
        <>
          <h4 className="text-lg font-bold text-gray-900 mb-2">{book.title}</h4>
          <p className="text-gray-700">Автор: {book.author}</p>
          {book.year && <p className="text-gray-700">Год: {book.year}</p>}
          {book.description && <p className="mt-2 text-gray-600">{book.description}</p>}

          {!isLibrarian && (
            <button
              onClick={handleBorrow}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Взять книгу
            </button>
          )}
        </>
      )}
    </div>
  );
}