import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks"; 
import { getActivities } from "../reduxActivities/reduxActivitiesAction";
import { Header } from "../header/Header";
import { links } from "../header/links";
import styles from "../layout/layout.module.css";

export default function Layout() {
  const dispatch = useAppDispatch();
  
  // Используем переменные
  const isAuthenticated = useAppSelector((store) => store.user.isAuthenticated);
  const isAdmin = useAppSelector((store) => store.user.isAdmin);

  // Получаем ссылки на основе состояния пользователя
  const userLinks = links(isAuthenticated, isAdmin); // Здесь используется isAuthenticated

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      dispatch(getActivities());
    }
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <Header userLinks={userLinks} /> {/* Передаем ссылки в Header */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
