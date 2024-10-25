import { HashRouter, Routes, Route } from "react-router-dom";
import ActivityList from "../activityList/ActivityList";
import AddActivityForm from "../addActivitiesForm/AddActivitiesForm";
import Login from "./Login";
import Register from "./Register";

import HomePage from "../homePages/HomePage";
import Layout from "../layout/Layout";
import ProtectedRoute from "../protectedRoute/ProtectedRoute";
import School from "../school/school";
import { UserProvider } from "../userContext/UserContext";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUserWithToken } from "./features/authAction";
import ActivityDetail from "../activityDetail/ActivityDetail";
import { Footer } from "../footer/Footer";
import ProjectCreators from "../projectCreators/ProjectCreators";
import DashBoard from "../dashBoard/DashBoard";
import RegistrationConfirmed from "../registrationConfirm/RegistrationConfirmed";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";


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
