

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
;
import { api } from "~/trpc/react";
import { BookCard } from "~/app/componets/BookCard";
import { BookList } from "~/app/componets/BookList";
import { AddBookForm } from "~/app/componets/AddBookForm";
import { ReviewBook } from "~/app/componets/ReviewBook";

export default async function BooksPage() {
  // const searchTerm = searchParams?.q || '';
  const session = await auth();
  if (!session) redirect('/');

  // const isLibrarian = session.user.role === "LIBRARIAN";



  return (
    <main>
      <BookList role={session.user.role} />
    </main>
  )}