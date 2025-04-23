'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

export function AddBookForm({refetch}:{refetch:()=> void }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    description: ''
    
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Инициализация мутации tRPC
  const createBook = api.book.create.useMutation({
    
    onSuccess: () => {
      // Очищаем форму после успешного добавления
      setFormData({
        title: '',
        author: '',
        year: '',
        description: ''
      });
    refetch()
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await createBook.mutateAsync({
        title: formData.title,
        author: formData.author,
        year: Number(formData.year),
        description: formData.description
      });
    } catch (err) {
      // Ошибка уже обрабатывается в onError
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
        disabled={isLoading || createBook.isPending}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading || createBook.isPending ? 'Добавление...' : 'Добавить книгу'}
      </button>
    </form>
  );
}