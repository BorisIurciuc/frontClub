import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  addReview,
  editReview,
  getReviews,
  deleteReview,
} from "./reviewAction";
import { IReviewData } from "./types/reviewData";
import ReviewAdd from "./ReviewAdd";
import ReviewEdit from "./ReviewEdit";
import styles from "./reviews.module.css";
import { ResponsesReview } from "../response/ResponsesReview";
import { RootState } from "../../app/store";
import ScrollToTopButton from "../scrollToTopButton/ScrollToTopButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

interface ReviewFormData {
  title: string;
  description: string;
}

const Reviews: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const { reviews, isLoading, error } = useAppSelector(
    (state) => state.reviews
  );

  const [inputData, setInputData] = useState<ReviewFormData>({
    title: "",
    description: "",
  });
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);

  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);

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

    try {
      const reviewDataToSubmit = {
        title: inputData.title,
        description: inputData.description,
        created_byId: user.id,
      };

      await dispatch(addReview(reviewDataToSubmit)).unwrap();
      setInputData({ title: "", description: "" });
      dispatch(getReviews());
      setShowAddReview(false);
    } catch (err) {
      console.error("Failed to add review:", err);
    }
  };

  const handleEditClick = (review: IReviewData) => {
    setEditingReviewId(review.id);
    setInputData({
      title: review.title,
      description: review.description,
    });
  };

  const handleEditSubmit = async (reviewId: number) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const reviewDataEditToSubmit = {
        reviewId,
        title: inputData.title,
        description: inputData.description,
      };

      await dispatch(editReview(reviewDataEditToSubmit)).unwrap();
      setEditingReviewId(null);
      setInputData({ title: "", description: "" });
      dispatch(getReviews());
    } catch (err) {
      console.error("Failed to edit review:", err);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
      dispatch(getReviews());
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const handleCancel = () => {
    setInputData({ title: "", description: "" });
    setEditingReviewId(null);
  };

  return (
    <div className={styles.reviewContainer}>
      <h2>Reviews</h2>
      <div className={styles.centerButtonWrapper}>
        <button
          className={showAddReview ? styles.cancel : styles.addReview}
          onClick={() => setShowAddReview((prev) => !prev)}
        >
          <FontAwesomeIcon icon={showAddReview ? faTimes : faPlus} className={styles.icon} />
          <span className={styles.buttonText}>
            {showAddReview ? "Cancel" : "Add Review"}
          </span>
        </button>
      </div>
      {showAddReview && (
        <div className={styles.containerAddReview}>
          <h3>Add Review</h3>
          <ReviewAdd
            inputData={inputData}
            isLoading={isLoading}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        </div>
      )}

      {error && <div className="error">Error: {error}</div>}

      <div>
        {reviews.length > 0 ? (
          [...reviews].reverse().map((review) => (
            <div key={review.id} className={styles.containerMap}>
              {editingReviewId === review.id ? (
                <ReviewEdit
                  inputData={inputData}
                  handleInputChange={handleInputChange}
                  handleEditSubmit={() => handleEditSubmit(review.id)}
                  handleCancelEdit={handleCancel}
                />
              ) : (
                <div className={styles.reviewContainer}>
                  <h3 className={styles.reviewTitle}>{review.title}</h3>
                  <p className={styles.descriptionReview}>{review.description}</p>
                  <div className={styles.reviewInfo}>
                    <p>Created by: {review.createdBy}</p>
                    <p>
                      Created at:{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className={styles.buttonContainer}>
                    <button
                      type="submit"
                      onClick={() => handleEditClick(review)}
                      className={styles.buttonEdit}
                      aria-label="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} className={styles.icon} />
                    </button>
                    {(user?.roles.includes("ROLE_ADMIN") ||
                      user?.username === review.createdBy) && (
                      <button
                        type="button"
                        onClick={() => handleDelete(review.id)}
                        className={styles.buttonDelete}
                        aria-label="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} className={styles.icon} />
                      </button>
                    )}
                  </div>

                  <div className={styles.responsesContainer}>
                    <ResponsesReview reviewId={review.id} />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default Reviews;
