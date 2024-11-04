import React from 'react';

interface ReviewFormData {
  title: string;
  description: string;
}

interface ReviewAddProps {
  inputData: ReviewFormData;
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ReviewAdd: React.FC<ReviewAddProps> = ({ inputData, isLoading, handleInputChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="">
      <div>
        <label htmlFor="title" className="">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={inputData.title}
          onChange={handleInputChange}
          className=""
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="">Description:</label>
        <textarea
          id="description"
          name="description"
          value={inputData.description}
          onChange={handleInputChange}
          className=""
          required
        />
      </div>

      <button
        type="submit"
        className=""
        disabled={isLoading}
      >
        Add Review
      </button>
    </form>
  );
};

export default ReviewAdd;
