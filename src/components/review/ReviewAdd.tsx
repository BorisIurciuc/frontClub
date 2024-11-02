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
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div>
        <label htmlFor="title" className="block mb-1">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={inputData.title}
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
          value={inputData.description}
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
        Add Review
      </button>
    </form>
  );
};

export default ReviewAdd;
