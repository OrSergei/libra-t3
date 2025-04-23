'use client';

import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import LoanPayment from "./LoanPayment";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  loan_sum: number;
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

  const[isQROpen, setIsQROpen] = useState(false)

  const loanMutation = api.loan.payDebt.useMutation({
    onSuccess: () => {
      alert('Долг оплачен!');
      refetch();
    },
  });

  const returnMutation = api.loan.returnBook.useMutation({
    onSuccess: () => {
      alert('Книга возвращена!');
      refetchLoan();
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

  function handlePayLoan() {
    loanMutation.mutate();
  }

  //обновление при заходе на страницу
  useEffect(() => {
    refetchLoan(); 
    refetch();
  }, []);


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
              {user.loan_sum !== 0 && (
                <div>
                <p className="text-red-15600 bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                > Долг: {user.loan_sum} Р</p>
                <button onClick={() => { setIsQROpen(!isQROpen) }} className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Создать QR для оплаты</button>
                { isQROpen && <LoanPayment onClick={handlePayLoan} userId={user.id} loan_sum={user.loan_sum} /> }
    
                </div>

              )}
            </div>
          </div>
        </div>
      {/* Спис
        ок книг */}
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

 
      </main>
    </div>
  );
}