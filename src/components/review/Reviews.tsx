import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getReviews } from './reviewAction';

const Reviews: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reviews, isLoading, error } = useAppSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);

  return (
    <div>
      <h2>Reviews</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id}>
            <p><strong>ID:</strong> {review.id}</p>
            <p><strong>Title:</strong> {review.title}</p>
            <p><strong>Description:</strong> {review.description}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Created by:</strong> {review.created_by}</p>
            <p><strong>Created at:</strong> {review.created_at}</p>
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
};

export default Reviews;