'use client';

type ReviewItemProps = {
  review: {
    id: number;
    user: { id: string; name: string | null };
    createdAt: Date; 
    rating: number;
    comment: string | null;
  };
  canDelete: boolean;
  onDelete: (reviewId: number) => void;
};

export default function ReviewItem({ review, canDelete, onDelete }: ReviewItemProps) {
  return (
    <div className="border border-gray-200 p-3 rounded shadow-sm bg-gray-50">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-700 font-medium">{review.user.name || 'Аноним'}</span>
        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-yellow-600">Оценка: {review.rating} / 5</p>
      <p className="text-gray-800">{review.comment}</p>
      {canDelete && (
        <button
          onClick={() => onDelete(review.id)}
          className="mt-2 text-sm text-red-600 hover:underline"
        >
          Удалить
        </button>
      )}
    </div>
  );
}
