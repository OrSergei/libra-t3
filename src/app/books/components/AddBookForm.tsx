'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AddBookForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          year: Number(formData.year),
          description: formData.description
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при добавлении книги');
      }

      // Очищаем форму
      setFormData({
        title: '',
        author: '',
        year: '',
        description: ''
      });

      // Обновляем список книг без перезагрузки страницы
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md space-y-4 max-w-xl">
      <h4 className="text-xl font-semibold">Добавить новую книгу</h4>
      
      {error && <div className="text-red-500">{error}</div>}
      
      <input
        type="text"
        name="title"
        placeholder="Название"
        value={formData.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        name="author"
        placeholder="Автор"
        value={formData.author}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="number"
        name="year"
        placeholder="Год"
        value={formData.year}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Описание"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? 'Добавление...' : 'Добавить книгу'}
      </button>
    </form>
  );
}