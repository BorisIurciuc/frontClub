import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import styles from './activityDetail.module.css';
import BackButton from '../backButton/BackButton';
import { useAppSelector } from '../../app/hooks';

interface Activity {
  id: number;
  title: string;
  address: string;
  startDate: string;
  image: string;
  description: string;
  authorId: number;
}

const ActivityDetail: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const [authorName, setAuthorName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  const location = useLocation();
  const activity = location.state?.activity as Activity | undefined;

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (!activity?.id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/activity/${activity.id}/author`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setAuthorName(response.data);
      } catch (err) {
        console.error("Error fetching author name:", err);
        setError("Failed to load author information");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorName();
  }, [activity?.id]);

  if (!activity) {
    return <div>Activity not found</div>;
  }

  const handleParticipate = async (activityId: number) => {
    try {
      const response = await axios.put(
        `/api/activity/${activityId}/add-user`, 
        null, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        }
      );
      
      if (response.status === 200) {
        alert("Successfully registered for the activity!");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // Получаем сообщение об ошибке напрямую из response.data
        const errorMessage = axiosError.response.data;
        console.log("Error response:", errorMessage);
        alert(errorMessage || "Failed to register for the activity. Please try again.");
      } else {
        alert("Failed to register for the activity. Network error.");
      }
    }
  };

  return (
    <div className={styles.activityDetailContainer}>
      <h1 className={styles.activityDetailTitle}>{activity.title}</h1>
      <img
        src={activity.image}
        alt={activity.title}
        className={styles.activityDetailImage}
        style={{ maxWidth: '500px', width: '100%', height: 'auto' }}
      />
      <p className={styles.activityDetailAddress}>
        <strong>Address:</strong> {activity.address}
      </p>
      <p className={styles.activityDetailDate}>
        <strong>Date:</strong> {activity.startDate}
      </p>
      <p className={styles.activityDetailDescription}>{activity.description}</p>
      
      <div className={styles.authorInfo}>
        <strong>Author:</strong>{' '}
        {loading ? (
          'Loading...'
        ) : error ? (
          <span className={styles.error}>{error}</span>
        ) : (
          authorName
        )}
      </div>
      
      <p>Current user: {user?.username}</p>
      
      
      {user?.id !== activity.authorId && (
        <button
          className={styles.participateButton}
          onClick={() => handleParticipate(activity.id)}
        >
          Participate
        </button>
      )}
      <BackButton />
    </div>
  );
};

export default ActivityDetail;