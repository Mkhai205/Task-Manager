import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signUp" element={<SignUp />} />

                    {/* { Admin Routes} */}
                    <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
                      <Route path="/admin/dashboard" element={<Dashboard />} />
                      <Route path="/admin/tasks" element={<ManageTasks />} />
                      <Route path="/admin/create-task" element={<CreateTask />} />
                      <Route path="/admin/users" element={<ManageUsers />} />
                    </Route>

                    {/* { User Routes} */}
                    <Route element={<PrivateRoute allowRoles={["admin"]}/>}>
                      <Route path="/user/dashboard" element={<UserDashboard />} />
                      <Route path="/user/my-tasks" element={<MyTasks />} />
                      <Route path="/user/task-detail/:id" element={<ViewTaskDetail />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
};

export default App;
