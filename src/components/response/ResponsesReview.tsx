import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addResponse, getResponse } from "./responseReviewAction";
import styles from "./response.module.css";
import ResponseRevAdd from "./ResponseReviewAdd";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface ResponsesRevProps {
  reviewId: number;
}

interface AddResponsesRevProps {
  content: string;
}

export const ResponsesReview = ({ reviewId }: ResponsesRevProps) => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.responseReview);
  
  const selectResponsesByReviewId = (reviewId: number) =>
    createSelector(
      (state: RootState) => state.responseReview.responses,
      (responses) => responses[reviewId] || []
    );
  const responses = useAppSelector(selectResponsesByReviewId(reviewId));

  const [inputData, setInputData] = useState<AddResponsesRevProps>({
    content: "",
  });
  const [showAddResponse, setShowAddResponse] = useState(false); // State to control 
 

  useEffect(() => {
    dispatch(getResponse(reviewId));
  }, [dispatch, reviewId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    if (!inputData.content) {
      console.error("Content is required");
      return;
    }

    try {
      const responseDataToSubmit = {
        reviewId: reviewId, // Add this line
        content: inputData.content,
        created_byId: user.id,
      };

      await dispatch(addResponse(responseDataToSubmit)).unwrap();
      setInputData({ content: "" });
      dispatch(getResponse(reviewId));
    } catch (err) {
      console.error("Failed to add response:", err);
    }
  };

  return (
    <div className={styles.containerResponse}>
      <h3>Responses</h3>

      <button onClick={() => setShowAddResponse((orev) => !orev)}>
        {showAddResponse ? "Cancel" : "Add Response"}
      </button>

      {showAddResponse && (
      <div className={styles.containerAddResponse}>
          <h3>Add Response</h3>
        <ResponseRevAdd
          inputData={inputData}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleSubmit}
        />
      </div>
      )}


      {error && <div className="">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : responses.length > 0 ? (
        [...responses].reverse().map((response) => (
          <div key={response.id} className="">
            <p className={styles.responseContent}>{response.content}</p>
            <p>Created by: {response.createdBy}</p>
            <p>Created at: {new Date(response.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>No responses available.</p>
      )}
    </div>
  );
};
