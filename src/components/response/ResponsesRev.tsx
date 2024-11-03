import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getResponse } from './responseRevAction';
import styles from './response.module.css';

interface ResponsesRevProps {
  reviewId: number;
}

export const ResponsesRev = ({ reviewId }: ResponsesRevProps) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.responseReview);
  const responses = useAppSelector((state) => state.responseReview.responses[reviewId] || []); // Get responses for specific reviewId

  useEffect(() => {
    dispatch(getResponse(reviewId));
  }, [dispatch, reviewId]);

  return (
    <div className={styles.containerResponse}>
      <h3>Responses</h3>
      {error && <div className="text-red-600">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        responses.length > 0 ? (
          responses.map((response) => (
            <div key={response.id} className="p-4 border rounded">
              <p className={styles.responseContent}>{response.content}</p>
              <p>Created by: {response.createdBy}</p>
              <p>Created at: {response.createdAt}</p>
            </div>
          ))
        ) : (
          <p>No responses available.</p>
        )
      )}
    </div>
  );
};
