import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import PrivateRoute from "./routes/PrivateRoute";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetail from "./pages/User/ViewTaskDetail";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signUp" element={<SignUp />} />

                    {/* { Admin Routes} */}
                    <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/tasks" element={<ManageTasks />} />
                        <Route path="/admin/create-task" element={<CreateTask />} />
                        <Route path="/admin/users" element={<ManageUsers />} />
                    </Route>

                    {/* { User Routes} */}
                    <Route element={<PrivateRoute allowRoles={["admin"]} />}>
                        <Route path="/user/dashboard" element={<UserDashboard />} />
                        <Route path="/user/my-tasks" element={<MyTasks />} />
                        <Route path="/user/task-detail/:id" element={<ViewTaskDetail />} />
                    </Route>

                    {/* Default Route */}
                    <Route path="/" element={<Root />} />
                </Routes>
            </Router>

            <Toaster
                toastOptions={{
                    className: "",
                    duration: 5000,
                    style: {
                        fontSize: "14px",
                    },
                }}
            />
        </UserProvider>
    );
};

export default App;

const Root = () => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <Outlet />; // Show loading state

    if (!user) return <Navigate to="/login" />; // Redirect to login if user is not authenticated

    return user.role === "admin" ? (
        <Navigate to="/admin/dashboard" />
    ) : (
        <Navigate to="/user/dashboard" />
    ); // Redirect based on user role
};
