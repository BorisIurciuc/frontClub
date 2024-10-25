import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './activityDetail.module.css';
import BackButton from '../backButton/BackButton';
import { useAppSelector } from '../../app/hooks'; // Добавьте импорт useAppSelector

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
  // Получаем информацию о пользователе из Redux store
  const user = useAppSelector((state) => state.user.user);
  
  const location = useLocation();
  const activity = location.state?.activity as Activity | undefined;

  if (!activity) {
    return <div>Activity not found</div>;
  }

  const handleParticipate = async (activityId: number) => {
    try {
      // Теперь вы можете использовать user.id
      console.log("Current user ID:", user?.id);
      
      const response = await axios.put(`/api/activity/${activityId}/add-user`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });
      if (response.status === 200) {
        alert("Successfully registered for the activity!");
      }
    } catch (error) {
      console.error("Error registering for activity:", error);
      alert("Failed to register for the activity. Please try again.");
    }
  };

  return (
    <div className={styles.activityDetailContainer}>
      <h1 className={styles.activityDetailTitle}>{activity.title}</h1>
      <img
        src={activity.image}
        alt={activity.title}
        className={styles.activityDetailImage}
      />
      <p className={styles.activityDetailAddress}>
        <strong>Address:</strong> {activity.address}
      </p>
      <p className={styles.activityDetailDate}>
        <strong>Date:</strong> {activity.startDate}
      </p>
      <p className={styles.activityDetailDescription}>{activity.description}</p>
      <p>Author - {activity.authorId}</p>
      <p>user - {user?.id}</p>
      <p>user - {user?.username}</p>
      
      {/* Можно добавить проверку, является ли текущий пользователь автором */}
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