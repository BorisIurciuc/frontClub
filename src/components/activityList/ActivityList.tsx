import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'; 
import styles from "./activityList.module.css";
import buttonStyles from "../button/button.module.css";
import Loader from '../loader/Loader';
import SearchBar from '../searchBar/SearchBar'; // Импортируем новый компонент

interface IActivity {
  id: number;
  title: string;
  image: string;
  startDate: string;
  description: string;
  address: string;
}

const ActivityList: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("api/activity");
      setActivities(response.data);
      setFilteredActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Не удалось загрузить активности. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = useCallback((term: string) => {
    const filtered = activities.filter(activity =>
      activity.title.toLowerCase().includes(term.toLowerCase()) ||
      activity.description.toLowerCase().includes(term.toLowerCase()) ||
      activity.address.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredActivities(filtered);
  }, [activities]);

  useEffect(() => {
    filterActivities(searchTerm);
  }, [searchTerm, filterActivities]);

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
      <div className={styles.headerContainer}>
        <h2 className={styles.pageTitle}>Активности</h2>
        <Link to="addActivity" className={`${buttonStyles.button} ${styles.addButton}`}>Добавить активность</Link>
      </div>

      {/* Используем компонент SearchBar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className={styles.activityListContainer}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className={styles.activityList}>
              <img src={activity.image} alt={activity.title} className={styles.activityImage} />
              <h3 className={styles.activityTitle}>{activity.title}</h3>
              <p className={styles.activityAddress}>{activity.address}</p>
              <p className={styles.activityStartDate}>Начало: {activity.startDate}</p>
              <p className={styles.activityDescription}>{activity.description}</p>
              <button className={buttonStyles.button} aria-label={`Подробнее о ${activity.title}`}>
                Подробнее
              </button>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>Нет активностей, соответствующих запросу.</div>
        )}
      </div>
    </>
  );
};

export default ActivityList;
