import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addResponse, deleteResponse, getResponse } from "./responseReviewAction";
import styles from "./responsesReview.module.css";
import ResponseRevAdd from "./ResponseReviewAdd";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { faTimes, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ResponsesRevProps {
  reviewId: number;
}

interface AddResponsesRevProps {
  content: string;
}

const selectResponsesByReviewId = (reviewId: number) =>
  createSelector(
    (state: RootState) => state.responseReview.responses,
    (responses) => responses[reviewId] || []
  );

export const ResponsesReview = ({ reviewId }: ResponsesRevProps) => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.responseReview);
  const responses = useAppSelector(selectResponsesByReviewId(reviewId));

  const [inputData, setInputData] = useState<AddResponsesRevProps>({ content: "" });
  const [showAddResponse, setShowAddResponse] = useState(false);
  const [showResponses, setShowResponses] = useState(true);

  useEffect(() => {
    dispatch(getResponse(reviewId));
  }, [dispatch, reviewId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return console.error("User not authenticated");
    if (!inputData.content) return console.error("Content is required");

    try {
      await dispatch(addResponse({
        reviewId,
        content: inputData.content,
        created_byId: user.id,
      })).unwrap();
      setInputData({ content: "" });
      setShowAddResponse(false);
      dispatch(getResponse(reviewId));
    } catch (err) {
      console.error("Failed to add response:", err);
    }
  };

  const handleDelete = async (responseId: number) => {
    try {
      await dispatch(deleteResponse(responseId)).unwrap();
      dispatch(getResponse(reviewId));
    } catch (err) {
      console.error("Failed to delete response:", err);
    }
  };

  return (
    <div className={styles.responseContainer}>
      <h3 className={styles.title}>Responses</h3>
  
      <button
        onClick={() => setShowAddResponse((prev) => !prev)}
        className={`${styles.toggleButton} ${showAddResponse ? styles.cancelButton : styles.addButton}`}
      >
        <FontAwesomeIcon icon={showAddResponse ? faTimes : faPlus} className={styles.icon} />
        {showAddResponse ? "Cancel" : "Add Response"}
      </button>
  
      {showAddResponse && (
        <div className={styles.addResponseContainer}>
          <h3 className={styles.addResponseTitle}>Add Response</h3>
          <ResponseRevAdd
            inputData={inputData}
            isLoading={isLoading}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleSubmit}
            handleDelete={() => setInputData({ content: "" })}
          />
        </div>
      )}
  
      <button onClick={() => setShowResponses((prev) => !prev)} className={styles.toggleResponsesButton}>
        {showResponses ? "Hide Responses" : "Show Responses"}
      </button>
  
      {error && <div className={styles.errorMessage}>{error}</div>}
  
      {isLoading ? (
        <div className={styles.loadingMessage}>Loading...</div>
      ) : showResponses ? (
        responses.length > 0 ? (
          [...responses].reverse().map((response) => (
            <div key={response.id} className={styles.responseItem}>
              <p className={styles.responseContent}>{response.content}</p>
              <p className={styles.createdBy}>Created by: {response.createdBy}</p>
              <p className={styles.createdAt}>Created at: {new Date(response.createdAt).toLocaleDateString()}</p>
  
              {(user?.roles.includes("ROLE_ADMIN") || user?.username === response.createdBy) && (
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(response.id)}
                >
                  <FontAwesomeIcon icon={faTrash} className={styles.icon} />
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className={styles.noResponsesMessage}>No responses available.</p>
        )
      ) : null} 
    </div>
  );
};
