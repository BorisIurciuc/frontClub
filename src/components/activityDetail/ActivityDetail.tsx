import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './activityDetail.module.css';
import BackButton from '../backButton/BackButton';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getUser } from '../../components/adminPanel/adminActions'; // Импортируем action

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
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const author = useAppSelector((state) => state.admin.user); // Получаем автора из админского стейта
  
  const location = useLocation();
  const activity = location.state?.activity as Activity | undefined;

  useEffect(() => {
    if (activity?.authorId) {
      dispatch(getUser(activity.authorId)); // Получаем информацию об авторе при монтировании компонента
    }
  }, [dispatch, activity?.authorId]);

  if (!activity) {
    return <div>Activity not found</div>;
  }

  const handleParticipate = async (activityId: number) => {
    try {
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
      <p>Author - {author?.username}</p> {/* Отображаем имя автора */}
      <p>Current user - {user?.username}</p>
      
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