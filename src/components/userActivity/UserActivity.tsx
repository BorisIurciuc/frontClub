import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../activityList/activityList.module.css";
import buttonStyles from "../button/button.module.css";
import SearchBar from "../searchBar/SearchBar";
import ScrollToTopButton from "../scrollToTopButton/ScrollToTopButton";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getActivities } from "../auth/reduxActivitiesAction";

interface IActivity {
  id: number;
  title: string;
  image: string;
  startDate: string;
  authorId: number;  
}

const ActivityList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [filteredActivities, setFilteredActivities] = useState<IActivity[]>([]);
  const [userRegisteredActivities, setUserRegisteredActivities] = useState<Set<number>>(new Set());
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const currentUserId = useAppSelector((state) => state.user.user?.id);  

// const userRole = useAppSelector((state) => state.user.role); 

  const [loading, setLoading] = useState(false);

  const fetchRegisteredActivities = async () => {
    try {
      const response = await axios.get("/api/activity/user/registered-activities", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const registeredActivities = new Set<number>(response.data);
      setUserRegisteredActivities(registeredActivities);
    } catch (error) {
      console.error("Error fetching registered activities:", error);
    }
  };

  useEffect(() => {
    dispatch(getActivities());
    if (isAuthenticated) {
      fetchRegisteredActivities();
    }
  }, [dispatch, isAuthenticated]);

  const handleParticipate = async (activityId: number) => {
    // const authorId = filteredActivities.find((activity) => activity.id === activityId)?.authorId;
   
    try {
      const response = await axios.put(`/api/activity/${activityId}/add-user`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        
      });
      if (response.status === 200) {
        alert("Successfully registered for the activity!");
        setUserRegisteredActivities((prev) => new Set([...prev, activityId]));
      }
    } catch (error) {
      console.error("Error registering for activity:", error);
      alert("Failed to register for the activity. Please try again.");
    }
  };

  const handleRevokeParticipation = async (activityId: number) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/activity/${activityId}/remove-user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        alert("You have successfully revoked your participation!");
        setUserRegisteredActivities((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(activityId);
          return updatedSet;
        });
      }
    } catch (error) {
      console.error("Error revoking participation:", error);
      alert("Failed to revoke your participation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.headerContainer}>
        <h2 className={styles.pageTitle}>Activity</h2>
        <Link to="addActivity" className={`${buttonStyles.button} ${styles.addButton}`}>
          Add activity
        </Link>
      </div>
      <SearchBar onFiltered={setFilteredActivities} />
      <div className={styles.activityListContainer}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className={styles.activityList}>
              <img src={activity.image} alt={activity.title} className={styles.activityImage} />
              <h3 className={styles.activityTitle}>{activity.title}</h3>
              <p className={styles.activityStartDate}>Start: {activity.startDate}</p>
              <Link
                to={`/activityList/${activity.id}`}
                state={{ activity }}
                className={buttonStyles.button}
                aria-label={`More about ${activity.title}`}
              >
                More
              </Link>

              {isAuthenticated && (
                <>
                 
                  {currentUserId === activity.authorId ? (
                    <Link
                      to={`/activityList/update/${activity.id}`}
                      className={`${buttonStyles.button} ${styles.editButton}`}
                    >
                      Edit Activity
                    </Link>
                  ) : !userRegisteredActivities.has(activity.id) ? (
                    <button
                      className={`${buttonStyles.button} ${styles.participateButton}`}
                      onClick={() => handleParticipate(activity.id)}
                    >
                      Participate
                    </button>
                  ) : (

                    <button
                      className={`${buttonStyles.button} ${styles.revokeButton}`}
                      onClick={() => handleRevokeParticipation(activity.id)}
                      disabled={loading}
                    >
                      {loading ? "Revoking..." : "Revoke"}
                    </button>

                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noResults}>No activities match the search query.</div>
        )}
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default ActivityList;