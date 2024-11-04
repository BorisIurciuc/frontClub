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
        className=""
      />
      <textarea
        name="description"
        value={inputData.description}
        onChange={handleInputChange}
        className=""
      />
      <button
        type="button"
        className=""
        onClick={handleEditSubmit}
      >
        Save
      </button>
      <button
        type="button"
        className=""
        onClick={handleCancelEdit}
      >
        Cancel
      </button>
    </div>
  );
};

export default ReviewEdit;
