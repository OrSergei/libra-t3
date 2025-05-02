'use client';
import { on } from 'events';
import { useState } from 'react';
import { set } from 'zod';
import { api } from "../../trpc/react";

export function ReviewBook({ bookId }: { bookId: number }) {
  const [rating, setRating] = useState<number>(5); // Текущий рейтинг (1-5)
  const [comment, setComment] = useState<string>(''); // Текст отзыва
//   const [bookId, setBookId] = useState<number>(0); // ID книги для отзыва
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Флаг отправки


  const [error, setError] = useState<string | null>(null);

  // Мутация для создания отзыва
  const createMutation = api.reviews.createReview.useMutation({
    onSuccess: () => {
        
      alert('Отзыв успешно добавлен!');
      // Сбрасываем форму после успешной отправки
      setRating(5);
      setComment('');
      setIsSubmitting(false);
    //   setBookId(0);
      // Обновляем список отзывов
  
    },
    
    onError: (err) => { 
      setError(err.message);
      setIsSubmitting(false);
    },
    
   
  });

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);


    setIsSubmitting(true);
    createMutation.mutate({
      bookId,
      rating,
      comment: comment || undefined // Комментарий не обязателен
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Оставить отзыв о книге</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
      

        {/* Выбор рейтинга */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ваша оценка *
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none`}
                disabled={isSubmitting}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Поле для комментария */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Комментарий
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Ваши впечатления о книге..."
            disabled={isSubmitting}
          />
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Отправка...
            </span>
          ) : 'Опубликовать отзыв'}
        </button>
      </form>

      {/* Подсказки */}
      <div className="mt-4 text-sm text-gray-500">
        <p>* Обязательные поля</p>
        <p>Рейтинг: 1 - плохо, 5 - отлично</p>
      </div>
    </div>
  );
}