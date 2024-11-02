// Reviews.tsx
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addReview, editReview, getReviews } from './reviewAction';
import { IReviewData } from './types/reviewData';
import ReviewAdd from './ReviewAdd';
import ReviewEdit from './ReviewEdit';

interface ReviewFormData {
  title: string;
  description: string;
}

const Reviews: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { reviews, isLoading, error } = useAppSelector((state) => state.reviews);
  
  const [inputData, setInputData] = useState<ReviewFormData>({
    title: '',
    description: '',
  });
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null); // Track the review being edited

  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const reviewDataToSubmit = {
        title: inputData.title,
        description: inputData.description,
        created_byId: user.id,
      };

      await dispatch(addReview(reviewDataToSubmit)).unwrap();
      setInputData({
        title: '',
        description: '',
      });
      dispatch(getReviews());
    } catch (err) {
      console.error('Failed to add review:', err);
    }
  };

  const handleEditClick = (review: IReviewData) => {
    setEditingReviewId(review.id);
    setInputData({
      title: review.title,
      description: review.description,
    });
  };

  const handleEditSubmit = async (reviewId: number) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const reviewDataEditToSubmit = {
        reviewId,
        title: inputData.title,
        description: inputData.description,
      };

      await dispatch(editReview(reviewDataEditToSubmit)).unwrap();
      setEditingReviewId(null); // Exit edit mode after submission
      setInputData({
        title: '',
        description: '',
      });
      dispatch(getReviews());
    } catch (err) {
      console.error('Failed to edit review:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      <ReviewAdd
        inputData={inputData}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          Error: {error}
        </div>
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded">
              {editingReviewId === review.id ? (
                <ReviewEdit
                  inputData={inputData}
                  handleInputChange={handleInputChange}
                  handleEditSubmit={() => handleEditSubmit(review.id)}
                  handleCancelEdit={() => setEditingReviewId(null)}
                />
              ) : (
                <div>
                  <h3 className="text-xl font-bold">{review.title}</h3>
                  <p className="mt-2">Created by: {review.createdBy}</p>
                  <p>Created at: {review.createdAt}</p>
                  <p className="mt-2">{review.description}</p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
                    onClick={() => handleEditClick(review)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
