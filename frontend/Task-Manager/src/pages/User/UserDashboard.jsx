import useUserAuth from "../../hooks/useUserAuth";

const UserDashboard = () => {
    useUserAuth();
    return (
        <div>
            <h1>User Dashboard</h1>
            <p>Welcome to your dashboard!</p>
        </div>
    );
};

export default UserDashboard;
