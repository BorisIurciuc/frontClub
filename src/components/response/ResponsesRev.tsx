import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getResponse } from './responseRevAction';
import styles from './response.module.css';

interface ResponsesRevProps {
  reviewId: number;
}

export const ResponsesRev = ({ reviewId }: ResponsesRevProps) => {
  const { responses, isLoading, error } = useAppSelector((state) => state.responseReview);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getResponse(reviewId)); // Fetch responses for the specified reviewId
  }, [dispatch, reviewId]);

// console.log(responses);


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
              <p className="font-bold">{response.content}</p>
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
