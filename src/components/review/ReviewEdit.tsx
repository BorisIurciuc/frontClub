import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./reviewEdit.module.css";

interface ReviewEditProps {
  inputData: {
    title: string;
    description: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleEditSubmit: () => void;
  handleCancelEdit: () => void;
}

const ReviewEdit: React.FC<ReviewEditProps> = ({
  inputData,
  handleInputChange,
  handleEditSubmit,
  handleCancelEdit,
}) => {
  return (
    <div className={styles.container}>
      <input
        type="text"
        name="title"
        value={inputData.title}
        onChange={handleInputChange}
        className={styles.inputField}
        placeholder="Enter title"
      />
      <textarea
        name="description"
        value={inputData.description}
        onChange={handleInputChange}
        className={styles.textareaField}
        placeholder="Enter description"
      />
      <button type="submit" className={`${styles.button} ${styles.saveButton}`} onClick={handleEditSubmit}>
        <FontAwesomeIcon icon={faSave} className={styles.icon} /> Save
      </button>
      <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={handleCancelEdit}>
        <FontAwesomeIcon icon={faTimes} className={styles.icon} /> Cancel
      </button>
    </div>
  );
};

export default ReviewEdit;
