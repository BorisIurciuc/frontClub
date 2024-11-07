import React from "react";
import styles from "./reviewAdd.module.css";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ReviewFormData {
  title: string;
  description: string;
}

interface ReviewAddProps {
  inputData: ReviewFormData;
  isLoading: boolean;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
}

const ReviewAdd: React.FC<ReviewAddProps> = ({
  inputData,
  handleInputChange,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <form onSubmit={handleSubmit} className={styles.formWrapper}>
      <div className={styles.inputGroup}>
        <label htmlFor="title" className={styles.label}>
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={inputData.title}
          onChange={handleInputChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="description" className={styles.label}>
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={inputData.description}
          onChange={handleInputChange}
          className={styles.textarea}
          required
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.button} ${styles.addReviewButton}`}
        >
          <FontAwesomeIcon icon={faPlus} className={styles.icon} />
          Add Review
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={handleCancel}
        >
          <FontAwesomeIcon icon={faTimes} className={styles.icon} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewAdd;
