'use client';

import { UserRole } from "@prisma/client";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import ReviewItem from "./ReviewItem";

export default function ReviewList({ bookId, userId, userRole }: { bookId: number; userId: string; userRole: string }) {
  const { data: allReviews = [], error: reviewsError, refetch } = api.reviews.getBookReviews.useQuery({ bookId });

  // Выбор нужного мутационного запроса
  const deleteMutation =
    userRole === UserRole.LIBRARIAN
      ? api.reviews.adminDeleteReview.useMutation({ onSuccess: () => refetch() })
      : api.reviews.deleteReview.useMutation({ onSuccess: () => refetch() });

  const handleDelete = async (reviewId: number) => {
    await deleteMutation.mutateAsync({ reviewId });
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="mt-4">
        
        
      {reviewsError && <p className="text-red-500">{reviewsError.message}</p>}
      <h3 className="text-lg font-semibold mb-2">Отзывы:</h3>
      {allReviews.length === 0 ? (
        <p className="text-gray-500">Пока нет отзывов.</p>
      ) : (
        <div className="space-y-4">
          {allReviews.map((review) => {
            const canDelete = userRole === UserRole.LIBRARIAN || userId === review.user.id;
            return (
              <ReviewItem
                key={review.id}
                review={review}
                canDelete={canDelete}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
