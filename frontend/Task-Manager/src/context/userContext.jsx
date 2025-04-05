import { createContext, useState, useEffect } from "react";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // New state to track loading

    useEffect(() => {
        if (user) return; // Prevent fetching if user is already set

        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false); // Set loading to false if no token is found
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data.data); // Set user data from the response
            } catch (error) {
                console.log("User not authenticated", error);
                clearUser(); // Clear user data if there's an error
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUser();
    }, []);

    const clearUser = () => {
        setUser(null); // Clear user data
        localStorage.removeItem("token"); // Remove token from local storage
    };

    const updateUser = (userData) => {
        setUser(userData); // Update user data
        localStorage.setItem("token", userData.token); // Store new token in local storage
        setLoading(false); // Set loading to false after updating user
    };

    return (
        <UserContext.Provider value={{ user, loading, clearUser, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
