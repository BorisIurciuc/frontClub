import { HashRouter, Routes, Route } from "react-router-dom";
import ActivityList from "./components/activityList/ActivityList";
import AddActivityForm from "./components/addActivitiesForm/AddActivitiesForm";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import HomePage from "./components/homePages/HomePage";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import { UserProvider } from "./components/userContext/UserContext";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { getUserWithToken } from "./components/auth/features/authAction";
import ActivityDetail from "./components/activityDetail/ActivityDetail";
import { Footer } from "./components/footer/Footer";
import ProjectCreators from "./components/projectCreators/ProjectCreators.tsx";
import DashBoard from "./components/dashBoard/DashBoard.tsx";
import AdminPanel from "./components/adminPanel/AdminPanel.tsx";
import UserList from "./components/adminPanel/UserList.tsx";
import NewsList from "./components/news/NewsList.tsx";
import RegistrationConfirmed from "./components/registrationConfirm/RegistrationConfirmed.tsx";
import School from "./components/school/School.tsx";



const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserWithToken());
  }, [dispatch]);

  return (
    <UserProvider>
      <HashRouter>
        <Routes>
          {/* Подтверждение регистрации */}
          <Route path="/registration-confirmed" element={<RegistrationConfirmed />} />
          
          {/* Основной layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/activityList" element={<ActivityList />} />
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
              path="/school"
              element={<ProtectedRoute element={<School />} />}
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="projectCreators" element={<ProjectCreators />} />
            <Route path="*" element={<h1>Error 404 😵</h1>} />
          </Route>

          {/* Панель администратора с защищенными маршрутами */}
          <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />}>
            <Route path="users" element={<UserList />} />
            <Route path="activities" element={<ActivityList />} />
            <Route path="news" element={<NewsList />} />
          </Route>
        </Routes>
        
        {/* Footer будет доступен на всех страницах */}
        <Footer />
      </HashRouter>
    </UserProvider>
  );
};

export default App;
