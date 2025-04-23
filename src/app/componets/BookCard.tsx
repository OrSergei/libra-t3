'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '~/trpc/react'; 
import { ReviewBook } from './ReviewBook';
import Link from 'next/link';
import { UserRole } from '@prisma/client';

type Book = {
  id: number;
  title: string;
  author: string;
  year?: number | null;
  description?: string | null;
};

export function BookCard({ role, book,  refetch }: { role: UserRole, book: Book; refetch: () => void }) {

  const [isReview, setIsReview] = useState(false);

    const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: book.id,
    title: book.title,
    author: book.author,
    year: book.year || null ,
    description: book.description || ''
  });


const createMutation = api.loan.create.useMutation({
  onSuccess: () => {
    alert('Книга добавлена в ваш профиль!');
    refetch();
    
  },
  onError: (err) => { 
    setError(err.message);
    
  },
  
});

const deleteMutation = api.book.delete.useMutation({
  onSuccess: () => {
    alert('Книга удалена!');
    refetch();
  },
  onError: (err) => { 
    setError(err.message);
    
  },
  
});

const updateMutation = api.book.update.useMutation({
  onSuccess: () => {
    alert('Книга обновлена!');
    refetch();
  },
  onError: (err) => { 
    setError(err.message);
    
  },
  
});

const handleAddReview = () => {
  setIsReview(!isReview);

};


  // Удаление книги
  const handleDelete = async () => {
    setError(null);
    await deleteMutation.mutateAsync({ id: formData.id });
  };

  // Редактирование книги
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Важно: предотвращаем перезагрузку страницы
    setError(null);
    try {
      await updateMutation.mutateAsync(formData);
      setIsEditing(false); // Выходим из режима редактирования после успеха
    } catch (error) {
      console.error("Ошибка при обновлении книги:", error);
      alert("Не удалось обновить книгу");
    }
  };

  // Взять книгу
  const handleBorrow = async () => {
    setError(null);
    await createMutation.mutateAsync({ id: formData.id });
    
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all relative">
      {error && <p className="text-red-500">{error}</p>}

      { role == UserRole.LIBRARIAN &&
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
      }
      

      

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
            value={formData.year ?? ''} 
            onChange={(e) => setFormData({
              ...formData, 
              year: e.target.value ? parseInt(e.target.value) : null
            })}
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

          {/* {!isLibrarian && ( */}
            <button
              onClick={handleBorrow}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Взять книгу
            </button>
       
        </>
        
      )}

     <button onClick={() => router.push (`/books/${book.id}`) } className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">

         Посмотреть отзывы
        </button>
                
      <button
      onClick={handleAddReview} className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">

        { isReview ?   'скрыть отзыв': 'Добавить отзыв ' }
      
      </button>
    
      {  isReview && 
        <ReviewBook bookId={book.id} />
      
      }

  
         
 
    </div>
    
  );
}