import { HashRouter, Routes, Route } from "react-router-dom";
import ActivityList from "./components/activityList/ActivityList";
import AddActivityForm from "./components/addActivitiesForm/AddActivitiesForm";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import HomePage from "./components/homePages/HomePage";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import School from "./components/school/school";
import { UserProvider } from "./components/userContext/UserContext";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getUserWithToken } from "./components/auth/features/authAction";
import ActivityDetail from "./components/activityDetail/ActivityDetail";
import { Footer } from "./components/footer/Footer";
import ProjectCreators from "./components/projectCreators/projectCreators";





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
            <Route
              path="/school"
              element={<ProtectedRoute component={<School />} />}
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route  path="/projectCreators" element={<ProjectCreators/>} />
            <Route path="*" element={<h1>Error 404 😵</h1>} />
          </Route>
        </Routes>
        <Footer />
      </HashRouter>
    </UserProvider>
  );
};

export default App;
