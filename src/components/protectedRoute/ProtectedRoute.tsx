import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface IProps {
  element: JSX.Element; // Используем 'element' для стандартного подхода
}

const ProtectedRoute: React.FC<IProps> = ({ element }) => {
  const { user } = useAppSelector((store) => store.user);

  // Проверяем, аутентифицирован ли пользователь
  if (user && user.username) {
    return element;
  }

  // Если не аутентифицирован, перенаправляем на страницу входа
  return <Navigate to="/Home" />;
};

export default ProtectedRoute;