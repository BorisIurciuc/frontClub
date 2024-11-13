import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./activityList.module.css";
import buttonStyles from "../button/button.module.css";
import SearchBar from "../searchBar/SearchBar";
import ScrollToTopButton from "../scrollToTopButton/ScrollToTopButton";
import { getActivities } from "../auth/reduxActivities/reduxActivitiesAction";
import { useAppDispatch } from "../../app/hooks";
import { faArrowRight, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  
  useEffect(() => {
    dispatch(getActivities());
  }, [dispatch]);

  return (
    <>
      <div className={styles.headerContainer}>
        <h2 className={styles.pageTitle}>Activities</h2>
        <Link to="addActivity" className={`${buttonStyles.button} ${styles.addButton}`}>
        <FontAwesomeIcon icon={faPlusCircle} className={styles.icon} />
          Add Activity
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
                More <FontAwesomeIcon icon={faArrowRight} className={styles.icon} /> 
              </Link>
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
