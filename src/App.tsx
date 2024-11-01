import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
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
import School from "./components/school/school";
import { UserProvider } from "./components/userContext/UserContext";
import Reviews from "./components/review/Reviews";


const App = () => {
  const isAuthenticated = useAppSelector((store) => store.user.isAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserWithToken());
  }, [dispatch, isAuthenticated]);

  return (
    <UserProvider>
      <HashRouter>
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
              path="/school"
              element={<ProtectedRoute component={<School />} />}
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/projectCreators" element={<ProjectCreators />} />
            <Route path="*" element={<h1>Error 404 😵</h1>} />
          </Route>
        </Routes>
        <Footer />
      </HashRouter>
    </UserProvider>
  );
};

export default App;

// for update