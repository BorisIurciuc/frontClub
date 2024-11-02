import React from 'react';

interface ReviewEditProps {
  inputData: {
    title: string;
    description: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleEditSubmit: () => void;
  handleCancelEdit: () => void;
}

const ReviewEdit: React.FC<ReviewEditProps> = ({ inputData, handleInputChange, handleEditSubmit, handleCancelEdit }) => {
  return (
    <div>
      <input
        type="text"
        name="title"
        value={inputData.title}
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-2"
      />
      <textarea
        name="description"
        value={inputData.description}
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        type="button"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
        onClick={handleEditSubmit}
      >
        Save
      </button>
      <button
        type="button"
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={handleCancelEdit}
      >
        Cancel
      </button>
    </div>
  );
};

export default ReviewEdit;
