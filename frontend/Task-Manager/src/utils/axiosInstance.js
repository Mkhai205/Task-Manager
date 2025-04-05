import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // Set a timeout of 10 seconds
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor to add the Authorization header if the token is available
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Handle unauthorized access (e.g., redirect to login page)
                localStorage.removeItem("token"); // Remove token from localStorage
                window.location.href = "/login"; // Redirect to login page
            } else if (error.response.status === 403) {
                // Handle forbidden access (e.g., show a message)
                alert("You do not have permission to access this resource.");
            } else if (error.response.status === 404) {
                // Handle not found error
                alert("Resource not found.");
            } else {
                // Handle other errors
                alert("An error occurred. Please try again later.");
            }
        } else if (error.request) {
            // The request was made but no response was received
            alert("No response from server. Please check your network connection.");
        } else {
            // Something happened in setting up the request that triggered an Error
            alert("Error: " + error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
