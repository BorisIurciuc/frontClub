import React from 'react';
import styles from './newsItem.module.css';

interface UpdateNewsProps {
  inputData: {
    title: string;
    description: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleUpdateSubmit: () => void;
  handleCancelUpdate: () => void;
}

const UpdateNews: React.FC<UpdateNewsProps> = ({
  inputData,
  handleInputChange,
  handleUpdateSubmit,
  handleCancelUpdate
}) => {
  return (
    <div className={styles.updateNewsForm}>
      <h3>Update News</h3>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="title"
          value={inputData.title}
          onChange={handleInputChange}
          placeholder="News Title"
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <textarea
          name="description"
          value={inputData.description}
          onChange={handleInputChange}
          placeholder="News Description"
          className={styles.textarea}
        />
      </div>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.saveButton}
          onClick={handleUpdateSubmit}
        >
          Save Changes
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancelUpdate}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateNews;
