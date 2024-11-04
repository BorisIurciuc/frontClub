import React, { useEffect } from "react";
import { Routes, Route, useNavigate, HashRouter } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getUserWithToken } from "./components/auth/features/authAction"; 

// Component Imports
import ActivityList from "./components/activityList/ActivityList";
import AddActivityForm from "./components/addActivitiesForm/AddActivitiesForm";
import ActivityDetail from "./components/activityDetail/ActivityDetail";
import AdminPanel from "./components/adminPanel/AdminPanel";
import DashBoard from "./components/dashBoard/DashBoard";
import EditProfile from "./components/editeProfile/EditProfile";
import ForgotPassword from "./components/auth/ForgotPassword";
import HomePage from "./components/homePages/HomePage";
import Layout from "./components/layout/Layout";
import Login from "./components/auth/Login";
import NewsList from "./components/adminPanel/manageNews/NewsList";
import ProjectCreators from "./components/projectCreators/ProjectCreators";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Register from "./components/auth/Register";
import RegistrationConfirmed from "./components/registrationConfirm/RegistrationConfirmed";
import ResetPassword from "./components/auth/ResetPassword";
import Reviews from "./components/review/Reviews";
import News from "./components/news/News";
import UserList from "./components/adminPanel/UserList";
import { UserProvider } from "./components/userContext/UserContext";
import { Footer } from "./components/footer/Footer";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((store) => store.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await dispatch(getUserWithToken()).unwrap();
        const userRoles = res?.payload?.roles || [];
        
        if (userRoles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else if (!isAuthenticated) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user with token", error);
      }
    };

    fetchUser();
  }, [dispatch, navigate, isAuthenticated]);

  return (
    <UserProvider>
      <header>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="homePage" element={<HomePage />} />
            <Route path="activityList" element={<ActivityList />} />
            <Route path="activity/:id" element={<ActivityDetail />} />
            <Route path="activityList/addActivity" element={<AddActivityForm onSuccess={() => console.log("Activity added successfully")} />} />
            <Route path="editProfile" element={<EditProfile />} />
            <Route path="review" element={<Reviews />} />
            <Route path="dashBoard" element={<DashBoard />} />
            <Route path="NewsList" element={<ProtectedRoute element={<News />} />} />
            <Route path="projectCreators" element={<ProjectCreators />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="registration-confirmed" element={<RegistrationConfirmed />} />
            <Route path="*" element={<h1>Error 404 😵</h1>} />

            {/* Admin Routes */}
            <Route path="admin" element={<ProtectedRoute element={<AdminPanel />} />}>
              <Route path="users" element={<UserList />} />
              <Route path="activities" element={<ActivityList />} />
              <Route path="news" element={<NewsList />} />
            </Route>
          </Route>
        </Routes>
        <Footer />
      </HashRouter>
    </UserProvider>
  );
};

export default App;
