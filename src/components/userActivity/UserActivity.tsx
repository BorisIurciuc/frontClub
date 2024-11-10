import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./userActivity.module.css";
import ScrollToTopButton from "../scrollToTopButton/ScrollToTopButton";
import { useAppSelector } from "../../app/hooks.ts";
import { faArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiX } from 'react-icons/fi';

interface IActivity {
  id: number;
  title: string;
  image: string;
  startDate: string;
  description: string;
}

const UserActivity: React.FC = () => {
  const [userActivities, setUserActivities] = useState<IActivity[]>([]);
  const [subscribedActivities, setSubscribedActivities] = useState<IActivity[]>(
    []
  );
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [unsubscribing, setUnsubscribing] = useState<number | null>(null);

  const fetchUserActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/api/activity/user/activities/created",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUserActivities(response.data);
    } catch (error) {
      setError("Error loading created activities. Please try again later.");
      console.error("Error fetching user activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribedActivities = async () => {
    try {
      const response = await axios.get("/api/activity/my-activities", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSubscribedActivities(response.data);
    } catch (error) {
      setError("Error loading subscribed activities. Please try again later.");
      console.error("Error fetching subscribed activities:", error);
    }
  };

  const handleDelete = async (activityId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this activity?"
    );
    if (!confirmDelete) return;

    setDeleting(activityId);
    try {
      await axios.delete(`/api/activity/${activityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Activity deleted successfully.");
      setUserActivities((prevActivities) =>
        prevActivities.filter((activity) => activity.id !== activityId)
      );
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete the activity. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleUnsubscribe = async (activityId: number) => {
    const confirmUnsubscribe = window.confirm(
      "Are you sure you want to unsubscribe from this activity?"
    );
    if (!confirmUnsubscribe) return;

    setUnsubscribing(activityId);
    try {
      await axios.delete(`/api/activity/${activityId}/remove-user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Unsubscribed successfully.");
      setSubscribedActivities((prevActivities) =>
        prevActivities.filter((activity) => activity.id !== activityId)
      );
    } catch (error) {
      console.error("Error unsubscribing from activity:", error);
      alert("Failed to unsubscribe. Please try again.");
    } finally {
      setUnsubscribing(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserActivities();
      fetchSubscribedActivities();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <>
      <div className={styles.activityContainer}>
        <div className={styles.activityUserContainer}>
          <h2 className={styles.sectionTitle}>Your Created Activities</h2>
          {userActivities.length > 0 ? (
            userActivities.map((activity) => (
              <div key={activity.id} className={styles.activityList}>
                <img
                  src={activity.image}
                  alt={activity.title}
                  className={styles.activityImage}
                />
                <h3 className={styles.activityTitle}>{activity.title}</h3>
                <p className={styles.activityStartDate}>
                  Начало: {activity.startDate}
                </p>
                <p className={styles.activityDescription}>
                  {activity.description}
                </p>
                <div className={styles.buttonContainer}>
                  <Link
                    to={`/activityList/${activity.id}`}
                    state={{ activity }}
                    className={`${styles.button} ${styles.moreButton}`}
                    aria-label={`more ${activity.title}`}
                  >
                    More{" "}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className={styles.icon}
                    />
                  </Link>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className={`${styles.button} ${styles.deleteButton}`}
                    disabled={deleting === activity.id}
                  >
                    <FontAwesomeIcon icon={faTrash} className={styles.icon} />

                    {deleting === activity.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              You have no created activities.
            </div>
          )}
        </div>

        <div className={styles.activityUserContainer}>
          <h2 className={styles.sectionTitle}>Subscribed Activities</h2>
          {subscribedActivities.length > 0 ? (
            subscribedActivities.map((activity) => (
              <div key={activity.id} className={styles.activityList}>
                <img
                  src={activity.image}
                  alt={activity.title}
                  className={styles.activityImage}
                />
                <h3 className={styles.activityTitle}>{activity.title}</h3>
                <p className={styles.activityStartDate}>
                  Начало: {activity.startDate}
                </p>
                <p className={styles.activityDescription}>
                  {activity.description}
                </p>
                <div className={styles.buttonContainer}>
                  <Link
                    to={`/activityList/${activity.id}`}
                    state={{ activity }}
                    className={`${styles.button} ${styles.moreButton}`}
                    aria-label={`more ${activity.title}`}
                  >
                    More{" "}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className={styles.icon}
                    />
                  </Link>
                  <button
                    onClick={() => handleUnsubscribe(activity.id)}
                    className={`${styles.button} ${styles.deleteButton}`}
                    disabled={unsubscribing === activity.id}
                  >
                    {unsubscribing === activity.id ? (
                      <>
                        <FiX className={styles.icon} /> Unsubscribing...
                      </>
                    ) : (
                      <>
                        <FiX className={styles.icon} /> Unsubscribe
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              You have no subscribed activities.
            </div>
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default UserActivity;
