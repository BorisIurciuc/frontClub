import React, { useState } from "react";
import styles from "./responseReviewAdd.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

interface ResponseRevFormData {
  content: string;
}

interface ResponseRevAddProps {
  inputData: ResponseRevFormData;
  isLoading: boolean;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  handleDelete: () => void;
}

const ResponseReviewAdd: React.FC<ResponseRevAddProps> = ({
  inputData,
  handleInputChange,
  handleFormSubmit,
  handleDelete,
}) => {
  const [localInputData, setLocalInputData] =
    useState<ResponseRevFormData>(inputData);

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalInputData({ content: e.target.value });
    handleInputChange(e);
  };

  const onDelete = () => {
    setLocalInputData({ content: "" });
    handleDelete();
  };

  return (
    <form onSubmit={handleFormSubmit} className={styles.responseForm}>
      <div className={styles.inputGroup}>
        <label htmlFor="content" className={styles.inputLabel}>
          Content:
        </label>
        <textarea
          id="content"
          name="content"
          value={localInputData.content}
          onChange={onInputChange}
          className={styles.responseTextarea}
          required
        />
      </div>
      <div className={styles.actionsContainer}>
        <button
          type="submit"
          className={`${styles.commonButton} ${styles.submitButton}`}
          onClick={handleFormSubmit} 
        >
          <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} />
          Submit
        </button>

        <button
          type="button"
          className={`${styles.commonButton} ${styles.deleteButton}`}
          onClick={onDelete}
        >
          <FontAwesomeIcon icon={faTrashAlt} className={styles.icon} />
          Delete
        </button>
      </div>
    </form>
  );
};

export default ResponseReviewAdd;
