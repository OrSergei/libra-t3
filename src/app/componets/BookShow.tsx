'use client';
import Link from 'next/link';
import { api } from '~/trpc/react';

export function ReadersWithLoans() {




    const { data } = api.show.getReadersWithActiveLoans.useQuery({ search: '', showOnlyOverdue: false });
    

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Читатели с книгами</h2>
      
      {data?.readers.map(reader => (
        <div key={reader.id} className="border p-4 rounded-lg">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{reader.name || reader.email}</h3>
              <p className="text-sm text-gray-600">
                Всего книг: {reader.totalLoans}
              </p>
            </div>
         
          </div>

          <div className="mt-2">
            <h4 className="font-medium text-sm">Взятые книги:</h4>
            <ul className="space-y-2 mt-1">
              {reader.loans.map(loan => (
                <li key={loan.id} className="text-sm">
                  <p>{loan.book.title} ({loan.book.author})</p>
                  <p className={loan.dueDate < new Date() ? 'text-red-500' : 'text-gray-600'}>
                    Вернуть до: {loan.dueDate.toLocaleDateString()}
                    {loan.dueDate < new Date() && ' (Просрочено)'}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}