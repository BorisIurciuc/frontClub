import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './adminPanel.module.css';

const AdminPanel: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Admin Panel</h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/activities" className={styles.link}>Manage Activities</NavLink>
          </li>
          <li>
            <NavLink to="/admin/news" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              Manage News
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
