import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addReview, getReviews } from './reviewAction';

interface ReviewFormData {
  title: string;
  description: string;
  
}

const Reviews: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reviews, isLoading, error } = useAppSelector((state) => state.reviews);
  
  const [formData, setFormData] = useState<ReviewFormData>({
    title: '',
    description: ''
    
  });

  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(addReview(formData)).unwrap();
      // Clear form after successful submission
      setFormData({
        title: '',
        description: ''
      });
      // Refresh reviews list
      dispatch(getReviews());
    } catch (err) {
      console.error('Failed to add review:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      
      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block mb-1">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
       
        

        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Review'}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          Error: {error}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded">
              <h3 className="text-xl font-bold">{review.title}</h3>
              <p className="mt-2">{review.description}</p>
              <div className="mt-2 text-sm text-gray-600">
                <p>ID: {review.id}</p>
                <p>Created by: {review.created_by}</p>
                <p>Created at: {new Date(review.created_at).toLocaleDateString()}</p>
                {review.rating && <p>Rating: {review.rating}</p>}
              </div>
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