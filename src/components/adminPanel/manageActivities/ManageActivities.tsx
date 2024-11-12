import React, { useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import styles from "../adminPanel.module.css";
import buttonStyles from "../../button/button.module.css";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

export const fetchAllActivities = createAsyncThunk(
  "admin/fetchAllActivities",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/activity", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch activities");
    }
  }
);

export const deleteActivity = createAsyncThunk(
  "admin/deleteActivity",
  async (activityId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/activity/${activityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return activityId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete activity");
    }
  }
);

const ManageActivities: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAdmin = useAppSelector((state) => state.user.user?.roles.includes("ROLE_ADMIN"));
  const activities = useAppSelector((state) => state.activity.activities);
  const loading = useAppSelector((state) => state.activity.loading);
  const error = useAppSelector((state) => state.activity.error);

  useEffect(() => {
    dispatch(fetchAllActivities()); // Load activities on component mount
  }, [dispatch]);

  const handleEdit = (activityId: number) => {
    navigate(`/activityList/editActivity/${activityId}`);
  };

  const handleDelete = (activityId: number) => {
    dispatch(deleteActivity(activityId));
  };

  if (!isAdmin) {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Manage Activities</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className={styles.activityListContainer}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <img src={activity.image} alt={activity.title} className={styles.activityImage} />
            <div className={styles.details}>
              <h3 className={styles.activityTitle}>{activity.title}</h3>
              <p className={styles.startDate}>Start: {activity.startDate}</p>
              <div className={styles.buttonContainer}>
                <button
                  className={buttonStyles.button}
                  onClick={() => handleEdit(activity.id)}
                >
                  Edit
                </button>
                <button
                  className={`${buttonStyles.button} ${buttonStyles.deleteButton}`}
                  onClick={() => handleDelete(activity.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageActivities;
