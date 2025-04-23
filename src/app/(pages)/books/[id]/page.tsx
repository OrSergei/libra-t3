import { redirect } from "next/navigation";
import ReviewLIst from "~/app/componets/ReviewLIst";
import { auth } from "~/server/auth";

export default async function BookPage({ params }: { params: { id: string } }) {

  const bookId = Number(params.id); // преобразуем в число
    const session = await auth();
  if (!session) redirect('/');

  return (
    <main>
      <ReviewLIst userRole={session.user.role} userId={session.user.id} bookId={bookId}/>
    </main>
  )}