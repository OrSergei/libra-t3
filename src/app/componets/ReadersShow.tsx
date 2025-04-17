

'use client';

import { api } from "~/trpc/react";




export function ReadsShow() {

    
// Получение детальной информации
const { data: usersWithDebts } = api.reader.getUsersWithDebts.useQuery()


return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Список пользователей с задолженностями</h2>
      
      {usersWithDebts?.length === 0 ? (
        <p>Нет пользователей с задолженностями</p>
      ) : (
        <div className="grid gap-4">
          {usersWithDebts?.map((user) => (
            <div key={user.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{user.name || 'Без имени'}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm">
                    Всего активных займов: {user.totalActiveLoans}
                  </p>
                  <p className="text-sm text-red-600">
                    Просроченных: {user.totalDebts}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  Зарегистрирован: {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              {user.loans.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Просроченные книги:</h4>
                  <ul className="space-y-2">
                    {user.loans.map((loan) => (
                      <li key={loan.id} className="border-t pt-2">
                        <p className="font-medium">{loan.book.title}</p>
                        <p className="text-sm">Автор: {loan.book.author}</p>
                        <p className="text-sm text-red-600">
                          Просрочено до: {new Date(loan.dueDate).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




