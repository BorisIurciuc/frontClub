import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addReview, editReview, getReviews, deleteReview } from './reviewAction';
import { IReviewData } from './types/reviewData';
import ReviewAdd from './ReviewAdd';
import ReviewEdit from './ReviewEdit';
import styles from './review.module.css';
import { ResponsesReview } from '../response/ResponsesReview';

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
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [showAddReview, setShowAddReview] = useState(false); // State to control add review form visibility

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
      setShowAddReview(false); // Hide add review form after submission
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
      setEditingReviewId(null);
      setInputData({
        title: '',
        description: '',
      });
      dispatch(getReviews());
    } catch (err) {
      console.error('Failed to edit review:', err);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
      dispatch(getReviews());
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  return (
    <div className="">
      <h2 className="">Reviews</h2>

      <button onClick={() => setShowAddReview((prev) => !prev)}>
        {showAddReview ? 'Cancel' : 'Add Review'}
      </button>

      {showAddReview && (
        <div className={styles.containerAddReview}>
          <h3>Add Review</h3>
          <ReviewAdd
            inputData={inputData}
            isLoading={isLoading}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      )}

      {error && (
        <div className="">
          Error: {error}
        </div>
      )}

      <div>
        {reviews.length > 0 ? (
          [...reviews].reverse().map((review) => (
            <div key={review.id} className={styles.containerMap}>
              {editingReviewId === review.id ? (
                <ReviewEdit
                  inputData={inputData}
                  handleInputChange={handleInputChange}
                  handleEditSubmit={() => handleEditSubmit(review.id)}
                  handleCancelEdit={() => setEditingReviewId(null)}
                />
              ) : (
                <div>
                  <h3 className="">{review.title}</h3>
                  <p className="">{review.description}</p>
                  <br />
                  <p className="">Created by: {review.createdBy}</p>
                  <p>Created at: {new Date(review.createdAt).toLocaleDateString()}</p>
                  <button
                    type="button"
                    className=""
                    onClick={() => handleEditClick(review)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className=""
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete
                  </button>
                  <ResponsesReview reviewId={review.id} />
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
