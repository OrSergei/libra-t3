// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { auth } from "~/server/auth";
// import { db } from "~/server/db";

// export default async function ProfilePage() {
//   const session = await auth();

//   if (!session?.user) {
//     redirect("/");
//   }

//   // const isLibrarian = session.user.role === "LIBRARIAN";


//   const userLoans = await db.loan.findMany({
//     where: { 
//       userId: session.user.id,
//       status: "ACTIVE"
//     },
//     include: {
//       book: true
//     },
//     orderBy: {
//       dueDate: "asc"
//     }
//   });

//   console.dir(session.user, { depth: 2 });

//   async function returnBook(loanId: number) {
//     "use server";
//     await db.loan.update({
//       where: { id: loanId },
//       data: { 
//         status: "RETURNED",
//         // returnDate: new Date() 
//       }
//     });
//     redirect("/profile");
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">

    
  
//       <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
 
//         <div className="mb-8 rounded-lg bg-white p-6 shadow">
//           <div className="flex items-center space-x-4">
          
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">
//                 {session.user.name}
//               </h2>
//               <p className="text-gray-600">Почта: {session.user.email}</p>
//               {/* <p className="text-gray-600">Роль: {isLibrarian ? "Библиотекарь" : "Читатель"}</p> */}
//             </div>
//           </div>
//         </div>


//         <div className="mb-8 rounded-lg bg-white p-6 shadow">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Мои книги ({userLoans.length})
//           </h3>
          
//           {userLoans.length > 0 ? (
//             <div className="space-y-4">
//               {userLoans.map((loan) => (
//                 <div key={loan.id} className="border rounded-lg p-4 flex justify-between items-center">
//                   <div>
//                     <h4 className="font-medium">{loan.book.title}</h4>
//                     <p className="text-sm text-gray-600">Автор: {loan.book.author}</p>
//                     <p className="text-sm text-gray-600">
//                       Срок возврата: {loan.dueDate.toLocaleDateString()}
//                     </p>
//                   </div>
//                   <form action={returnBook.bind(null, loan.id)}>
//                     <button 
//                       type="submit"
//                       className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
//                     >
//                       Вернуть
//                     </button>
//                   </form>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">У вас нет взятых книг</p>
//           )}
//         </div>

  
//         {/* {isLibrarian && ( */}
//           <div className="rounded-lg bg-indigo-50 p-6">
 
//             <div className="flex space-x-4">
//               <Link
//                 href="/books/add"
//                 className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
//               >
//                 Добавить книгу
//               </Link>
//             </div>
//           </div>
//         {/* )} */}
//       </main>
//     </div>
//   );
// }

import { redirect } from "next/navigation";
import ProfileClient from "~/app/componets/ProfileClient";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
// import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }



  return (
    <main>
    <ProfileClient 
        // user={session.user} 
        
      />
    </main>
  
  );
}