import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchAllUsers, getUser } from "./adminActions";
import { RootState, AppDispatch } from "../../app/store"; // Импортируйте типы
import { IUser } from "../features/auth/authSlice";

const UserList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Используем AppDispatch для типизации dispatch
  const { users, loading, error } = useSelector((state: RootState) => state.admin); // Проверяем правильность имен полей
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null); // Состояние для выбранного пользователя

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (userId: number) => {
    dispatch(deleteUser(userId));
  };

  const handleGetUser = async (userId: number) => {
    const user = await dispatch(getUser(userId)).unwrap(); // Используем unwrap для получения результата
    setSelectedUser(user); // Устанавливаем выбранного пользователя
  };

  if (loading) return <p>Loading...</p>; // Используем loading вместо isLoading
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.id})
            <button onClick={() => handleDelete(user.id)}>Delete</button>
            <button onClick={() => handleGetUser(user.id)}>Info</button>
          </li>
        ))}
      </ul>

      {selectedUser && ( // Если выбранный пользователь существует, отображаем его информацию
        <div>
          <h3>User Info</h3>
          <p>Username: {selectedUser.username}</p>
          <p>ID: {selectedUser.id}</p>
          {/* Добавьте дополнительные поля пользователя, если необходимо */}
        </div>
      )}
    </div>
  );
};

export default UserList;

