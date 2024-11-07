import React from "react";
import styles from "./response.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

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
}

const ResponseReviewAdd: React.FC<ResponseRevAddProps> = ({
  inputData,
  isLoading,
  handleInputChange,
  handleFormSubmit,
}) => {
  return (
    <form onSubmit={handleFormSubmit} className={styles.responseForm}>
      <div className={styles.inputGroup}>
        <label htmlFor="content" className={styles.inputLabel}>
          Content:
        </label>
        <textarea
          id="content"
          name="content"
          value={inputData.content}
          onChange={handleInputChange}
          className={styles.responseTextarea}
          required
        />
      </div>
      <div className={styles.actionsContainer}>
        <button disabled={isLoading} type="submit" className={styles.submitButton}>
          <FontAwesomeIcon icon={faCheck} className={styles.icon} />
          Submit
        </button>
        <button type="button" className={styles.deleteButton}>
          <FontAwesomeIcon icon={faTrashAlt} className={styles.icon} />
          Delete
        </button>
      </div>
    </form>
  );
};

export default ResponseReviewAdd;
