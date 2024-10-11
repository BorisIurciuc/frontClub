import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./activityList.module.css";
import buttonStyles from "../button/button.module.css";
import SearchBar from "../searchBar/SearchBar";
import AddActivityForm from "../addActivitiesForm/AddActivitiesForm";

interface IActivity {
  id: number;
  title: string;
  image: string;
  startDate: string;
  description: string;
  address: string;
}

const ActivityList: React.FC = () => {
  const [filteredActivities, setFilteredActivities] = useState<IActivity[]>([]);
  
  const navigate = useNavigate();

  const handleDetailsClick = (activity: IActivity) => {
    navigate(`/activityList/${activity.id}`, { state: { activity } });
  };

  return (
    <>
      <div className={styles.headerContainer}>
        <h2 className={styles.pageTitle}>Активности</h2>
        <button className={`${buttonStyles.button} ${styles.addButton}`} onClick={() => AddActivityForm}> 
          Добавить активность
        </button>
      </div>

      <SearchBar onFiltered={setFilteredActivities} />

      <div className={styles.activityListContainer}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className={styles.activityList}>
              <img
                src={activity.image}
                alt={activity.title}
                className={styles.activityImage}
              />
              <h3 className={styles.activityTitle}>{activity.title}</h3>
              <button
                className={buttonStyles.button}
                onClick={() => handleDetailsClick(activity)}
                aria-label={`Подробнее о ${activity.title}`}
              >
                Подробнее
              </button>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            Нет активностей, соответствующих запросу.
          </div>
        )}
      </div>
    </>
  );
};

export default ActivityList;
