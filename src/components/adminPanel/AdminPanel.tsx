import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './adminPanel.module.css';

const AdminPanel: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Admin Panel</h1>
      <nav>
        <ul>
          <li>
            <Link to="/admin/users" className={styles.link}>Manage Users</Link>
          </li>
          <li>
            <Link to="/admin/activities" className={styles.link}>Manage Activities</Link>
          </li>
          <li>
            <Link to="/admin/news" className={styles.link}>Manage News</Link>
          </li>
        </ul>
      </nav>
      
      {/* Рендер выбранного раздела */}
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
