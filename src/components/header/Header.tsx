import React from "react";
import styles from "./header.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";
import { cleanActivities } from "../reduxActivities/reduxActivitiesSlice";
import { links } from "./links"; // Импортируем функцию links

interface HeaderProps {
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAdmin }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { user } = useAppSelector((store) => store.user);
  const isAuthenticated = Boolean(user?.username); // Используем переменную isAuthenticated

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    dispatch(logoutUser());
    dispatch(cleanActivities());
    window.location.href = "/";
  };

  const userLinks = links(isAuthenticated, isAdmin); // Используем переменную для получения ссылок

  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
        <h1>Conversation Club</h1>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
          {userLinks.map((link) => (
            <Link
              key={link.pathname}
              className={location.pathname === link.pathname ? styles.active : ""}
              to={link.pathname}
            >
              {link.title}
            </Link>
          ))}

          {/* Проверяем, является ли пользователь администратором и аутентифицирован ли он */}
          {isAuthenticated && user?.roles.includes("ROLE_ADMIN") && (
            <li>
              <Link to="/admin" className={styles.adminLink}>
                Admin Panel
              </Link>
            </li>
          )}
        </div>
        {isAuthenticated ? (
          <div className={styles.signOut}>
            <Link to="/dashboard">
              <span className={styles.username}>{user?.username}</span>
            </Link>
            <Link onClick={handleLogout} to="/">
              Sign out
            </Link>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.loginButton}>
              Sign In
            </Link>
            <Link to="/register" className={styles.registerButton}>
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
