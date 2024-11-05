import { useEffect } from "react";
import {  Routes, Route, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import ActivityDetail from "./components/activityDetail/ActivityDetail";
import ActivityList from "./components/activityList/ActivityList";
import AddActivityForm from "./components/addActivitiesForm/AddActivitiesForm";
import { getUserWithToken } from "./components/auth/features/authAction";
import ForgotPassword from "./components/auth/ForgotPassword";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ResetPassword from "./components/auth/ResetPassword";
import DashBoard from "./components/dashBoard/DashBoard";
import EditProfile from "./components/editeProfile/EditProfile";
import { Footer } from "./components/footer/Footer";
import HomePage from "./components/homePages/HomePage";
import Layout from "./components/layout/Layout";
import ProjectCreators from "./components/projectCreators/ProjectCreators";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import RegistrationConfirmed from "./components/registrationConfirm/RegistrationConfirmed";
import { UserProvider } from "./components/userContext/UserContext";
import Reviews from "./components/review/Reviews";
import News from "./components/news/News";
import UserList from "./components/adminPanel/UserList";
import NewsList from "./components/adminPanel/manageNews/NewsList";
import AdminPanel from "./components/adminPanel/AdminPanel";
import { PayloadAction } from "@reduxjs/toolkit";
const App = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((store) => store.user);
  // Функция для выхода (очистка токена и перезагрузка страницы)
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res: PayloadAction<any> = await dispatch(getUserWithToken()).unwrap();
        const userRoles = res?.payload?.roles || [];
        // Если у пользователя есть роль администратора, перенаправляем на панель администратора
        if (userRoles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else if (!isAuthenticated) {
          navigate("/login"); // Перенаправляем неаутентифицированных пользователей на страницу логина
        }
      } catch (error) {
        console.error("Error fetching user with token", error);
      }
    };
    fetchUser();
  }, [dispatch, navigate, isAuthenticated]);
  return (
    <UserProvider>
      {/* Добавление кнопки "Выйти" */}
     
        <Routes>
          <Route
            path="/registration-confirmed"
            element={<RegistrationConfirmed />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/activityList" element={<ActivityList />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/review" element={<Reviews />} />
            <Route
              path="/activityList/addActivity"
              element={
                <AddActivityForm
                  onSuccess={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              }
            />
            <Route path="/activityList/:id" element={<ActivityDetail />} />
            <Route path="/dashBoard" element={<DashBoard />} />
            <Route
              path="/news"
              element={<ProtectedRoute element={<News />} />}
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/projectCreators" element={<ProjectCreators />} />
            <Route path="*" element={<h1>Error 404 :dizzy_face:</h1>} />
            <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />}>
            <Route path="users" element={<UserList />} />
            <Route path="activities" element={<ActivityList />} />
            <Route path="news" element={<NewsList />} />
          </Route>
          </Route>
        </Routes>
        <Footer />
    </UserProvider>
  );
};
export default App;