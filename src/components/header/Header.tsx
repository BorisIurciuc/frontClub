import React from "react";
import styles from "./header.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../auth/features/authSlice";
import { cleanActivities } from "../auth/reduxActivities/reduxActivitiesSlice";
import { links } from "./links";

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { user } = useAppSelector((store) => store.user);
  let isAuthenticated = Boolean(user?.username);

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    dispatch(logoutUser());
    dispatch(cleanActivities());
    window.location.href = "/";
    isAuthenticated = false
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
        <h1>Conversation Club</h1>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
        {/*<span className={styles.username}>{user?.username}</span>*/}

          {links(isAuthenticated).map((link) => (
            <Link
              key={link.pathname}
              className={
                location.pathname === link.pathname ? styles.active : ""
              }
              to={link.pathname}
            >
              {link.title}
            </Link>
          ))}
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
