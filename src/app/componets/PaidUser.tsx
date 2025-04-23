'use client';

import { api } from "~/trpc/react";






export function PaidUser () {

    const { data, isLoading, error } = api.payments.getPaidAndDebtorUsers.useQuery();
    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error.message}</p>;
 
    //пробовал разные способы
 

    return (
      <div>
        <h2>Читатели с долгами / оплатившие:</h2>
        {data?.map(user => (
          <div key={user.userId}>
            <label>Имя: {user.name}</label>
            <label>Долг: {user.loan_sum} ₸</label>
            <div>Статусы: {user.loans.map((l, i) => {
              return (
                <div key={i} className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <label>Книга: {l.bookTitle}</label>
                  <label>Дата выдачи: {l.loanDate.toString()}</label>
                  <label>Срок возврата: {l.dueDate.toString()}</label>
                  <label>Статус оплаты: {l.penaltyStatus}</label>
                </div>
              )
            })}</div>
            <hr />
          </div>
        ))}
      </div>
    );    
}