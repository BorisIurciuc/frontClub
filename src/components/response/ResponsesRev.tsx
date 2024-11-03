import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addResponse, getResponse } from './responseRevAction';
import styles from './response.module.css';
import ResponseRevAdd from './ResponseRevAdd';

interface ResponsesRevProps {
  reviewId: number
    
}

interface AddResponsesRevProps {
  content: string
  
}

export const ResponsesRev = ({ reviewId }: ResponsesRevProps) => {

  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.responseReview);
  const responses = useAppSelector((state) => state.responseReview.responses[reviewId] || []); // Get responses for specific reviewId

  const [inputData, setInputData] = useState<AddResponsesRevProps>({
    content: ''
  });

  useEffect(() => {
    dispatch(getResponse(reviewId));
  }, [dispatch, reviewId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    if (!inputData.content) {
      console.error('Content is required');
      return;
    }

    try {
      const responseDataToSubmit = {
        reviewId: reviewId, // Add this line
        content: inputData.content,
        created_byId: user.id,
      };

      await dispatch(addResponse(responseDataToSubmit)).unwrap();
      setInputData({ content: '' });
      dispatch(getResponse(reviewId));
    } catch (err) {
      console.error('Failed to add response:', err);
    }
    };


  return (
    <div className={styles.containerResponse}>
      <h3>Responses</h3>

      <ResponseRevAdd
        inputData={inputData}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleSubmit}
      />

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
