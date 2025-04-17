'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role?: "USER" | "LIBRARIAN";
}

interface Book {
  id: number;
  title: string;
  author: string;
}

interface Loan {
  id: number;
  bookId: number;
  dueDate: Date;
  book: Book;
}

interface ProfileClientProps {
  user: User;
  loans: Loan[];
  returnBook: (loanId: number) => void;
}



export default function ProfileClient() {
  // const isLibrarian = user.role === "LIBRARIAN";
  const { data: user , refetch } = api.user.getCurrentUser.useQuery();
  const { data: loans= [] , refetch: refetchLoan } = api.loan.getUserLoans.useQuery();
  const [isEditingName, setIsEditingName] = useState(false);
const [newName, setNewName] = useState(user?.name || '');

  const returnMutation = api.loan.returnBook.useMutation({
    onSuccess: () => {
      alert('Книга возвращена!');
      refetch();
    },
  });

  const updateMutation = api.user.updateName.useMutation({
    onSuccess: () => {
      alert('Имя обновлено!');
      refetch();
    },
  });

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({name:newName})
    setIsEditingName(false);

  };

  function handleReturnBook(loanId: number) {
    returnMutation.mutate({ loanId });
  }

  if(!user){
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p>Пользователь не найден</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Профиль пользователя */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <div className="flex items-center space-x-4">
            <div>
            {isEditingName ? (
              <form 
                onSubmit={handleNameSubmit}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="Новое имя"
                />
                <button 
                  type="submit"
                  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                >
                  Сохранить
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
                >
                  Отмена
                </button>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.name || "Пользователь"}
                </h2>
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Изменить имя"
                >
                  ✏️
                </button>
              </>
            )}
       
              <p className="text-gray-600">Почта: {user.email!}</p>
              {/* {user.role && (
                <p className="text-gray-600">Роль: {isLibrarian ? "Библиотекарь" : "Читатель"}</p>
              )} */}
            </div>
          </div>
        </div>
      {/* Список книг */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Мои книги ({loans.length})
                </h3>
                
                {loans.length > 0 ? (
                  <div className="space-y-4">
                    {loans.map((loan) => (
                      <div key={loan.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{loan.book.title}</h4>
                          <p className="text-sm text-gray-600">Автор: {loan.book.author}</p>
                          <p className="text-sm text-gray-600">
                            Срок возврата: {loan.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleReturnBook(loan.id)}
                          disabled={returnMutation.isPending}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50"
                        >
                          {returnMutation.isPending ? "Возвращается..." : "Вернуть"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">У вас нет взятых книг</p>
                )}
              </div>

        {/* Панель библиотекаря */}
        {/* {isLibrarian && ( */}
          <div className="rounded-lg bg-indigo-50 p-6">
            <div className="flex space-x-4">
              <Link
                href="/books/add"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Добавить книгу
              </Link>
            </div>
          </div>
        {/* )} */}
      </main>
    </div>
  );
}