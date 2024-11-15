import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchAllUsers, getUser } from "./userActions";
import styles from "./userList.module.css";
import { AppDispatch, RootState } from "../../../app/store";
import { IUser } from "../../auth/features/authSlice";
import ScrollToTopButton from "../../scrollToTopButton/ScrollToTopButton";

const UserList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.admin
  );
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (userId: number) => {
    dispatch(deleteUser(userId));
  };

  const handleGetUser = async (userId: number) => {
    const user = await dispatch(getUser(userId)).unwrap();
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Users</h2>
      <div className={styles.cardContainer}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <h3>{user.username}</h3>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>
              Roles:{" "}
              {user.roles.map((role: any) => role.name || role.role).join(", ")}
            </p>
            <p
              className={`${styles.status} ${
                !user.active ? styles.inactive : ""
              }`}
            >
              Status: {user.active ? "Active" : "Inactive"}
            </p>
            <div className={styles.buttonGroup}>
              <button
                onClick={() => handleDelete(user.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
              <button
                onClick={() => handleGetUser(user.id)}
                className={styles.infoButton}
              >
                Info
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>User Info</h3>
            <p>Username: {selectedUser.username}</p>
            <p>ID: {selectedUser.id}</p>
            <p>Email: {selectedUser.email}</p>
            <p>
              Roles:{" "}
              {selectedUser.roles
                .map((role: any) => role.name || role.role)
                .join(", ")}
            </p>
            <p>Status: {selectedUser.active ? "Active" : "Inactive"}</p>
            <button onClick={handleCloseModal} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default UserList;
