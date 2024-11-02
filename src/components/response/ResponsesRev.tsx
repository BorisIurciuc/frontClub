import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getResponse } from './responseRevAction';

export const ResponsesRev = () => {

  const { responses, isLoading, error } = useAppSelector((state) => state.responseRev);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(getResponse());
  }, [dispatch]);

  return (
    <div>Responses

      {error && <div>{error}</div>}
      {isLoading && <div>Loading...</div>}
      {responses.length > 0 ? (
          responses.map((response) => (
              <div key={response.id} className="p-4 border rounded">
                <h3 className="text-xl font-bold">{response.content}</h3>
                <p className="mt-2">Created by: {response.createdBy}</p>
                <p>Created at: {response.createdAt}</p>
                
                {/* <p>ID: {review.id}</p> */}
                {/* <div className="mt-2 text-sm text-gray-600">
                  {review.rating && <p>Rating: {review.rating}</p>}
                </div> */}
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}

    </div>
  )
}
