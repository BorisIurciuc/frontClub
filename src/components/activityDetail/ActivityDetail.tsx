import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './activityDetail.module.css';
import BackButton from '../backButton/BackButton';
import { useAppSelector } from '../../app/hooks';
import { handleParticipate, handleRevokeParticipation } from "./activityActions";

const ActivityDetail: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const [authorName, setAuthorName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate(); 
  const activity = location.state?.activity;

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (!activity?.id) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/activity/${activity.id}/author`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAuthorName(response.data);
      } catch (err) {
        console.error("Error fetching author name:", err);
        setError("Failed to load author information");
      } finally {
        setLoading(false);
      }
    };

    const checkRegistration = async () => {
      if (!activity?.id || !user) return;

      try {
        const response = await axios.get(`/api/activity/${activity.id}/is-registered`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsRegistered(response.data); 
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };

    if (user?.roles?.includes("ROLE_ADMIN")) {
      setIsAdmin(true);
    }

    fetchAuthorName();
    checkRegistration();
  }, [activity?.id, user]);

  const handleParticipationClick = async () => {
    if (!user) {
      alert("Please log in to participate in this event."); 
      navigate("/login"); 
      return;
    }

    if (!activity) {
      console.error("Activity is not defined");
      return;
    }

    if (isRegistered) {
      await handleRevokeParticipation(activity.id);
      setIsRegistered(false);
    } else {
      await handleParticipate(activity.id);
      setIsRegistered(true); 
    }
  };

  const handleDeleteActivity = async () => {
    if (!activity) {
      console.error("Activity is not defined");
      return;
    }

    try {
      await axios.delete(`/api/activity/${activity.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Activity deleted successfully");
      navigate("/admin/activities");
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity");
    }
  };

  if (!activity) {
    return <div>Activity not found</div>;
  }

  return (
    <div className={styles.activityDetailContainer}>
      <h1 className={styles.activityDetailTitle}>{activity.title}</h1>
      <img
        src={activity.image}
        alt={activity.title}
        className={styles.activityDetailImage}
      />
      <p className={styles.activityDetailDate}>
        <strong>Date:</strong> {activity.startDate}
      </p>
      <p className={styles.activityDetailAddress}>
        <strong>Address:</strong> {activity.address}
      </p>
      <p className={styles.activityDetailDescription}>{activity.description}</p>
      
      <div className={styles.authorInfo}>
        <strong>Author:</strong>{' '}
        {loading ? 'Loading...' : error ? <span className={styles.error}>{error}</span> : authorName}
      </div>
      
      <p>Current user: {user?.username}</p>

      <div className={styles.buttonContainer}>
        {user?.id !== activity.authorId && (
          <button
            className={isRegistered ? styles.revokeButton : styles.participateButton}
            onClick={handleParticipationClick}
            disabled={loading}
          >
            {isRegistered ? "Revoke Participation" : "Participate"}
          </button>
        )}
        
        {isAdmin && (
          <button
            className={styles.deleteButton}
            onClick={handleDeleteActivity}
          >
            Delete Activity
          </button>
        )}
      </div>
      <BackButton />
    </div>
  );
};

export default ActivityDetail;
