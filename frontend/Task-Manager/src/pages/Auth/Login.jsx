import { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input.jsx";
import { validateEmail, validatePassword } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/userContext.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const { updateUser } = useContext(UserContext); // Import the context to update user data

    // Handle Login Form Submit
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Invalid email address");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setError(""); // Clear any previous error

        // Login API Call
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });

            console.log(response.data); // Log the response data for debugging
            

            const { token, role } = response.data.data;

            if (token) {
                localStorage.setItem("token", token); // Store the token in local storage
                updateUser(response.data.data); // Update user context with the response data

                // Redirect based on user role
                if (role === "admin") {
                    navigate("/admin/dashboard");
                } else if (role === "member") {
                    navigate("/user/dashboard");
                } else {
                    setError("Invalid user role. Please contact support.");
                }
            }
        } catch (error) {
            if(error.response && error.response.data.message) {
                setError(error.response.data.message); // Set error message from server response
            } else {
                setError("Something went wrong. Please try again later."); // Fallback error message
            }
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col items-center justify-center m-auto bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-center mb-4">Welcome back</h3>
                <p className="text-gray-600 text-lg mb-4 text-center">
                    Please enter your credentials to access your account.
                </p>
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-2">
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email Address"
                        placeholder="abc@gmail.com"
                        type="text"
                    />

                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        placeholder="Min 8 characters"
                        type="password"
                    />

                    {error && <p className="m-auto w-[80%] text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full max-w-md m-auto mt-3 mb-3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        LOGIN
                    </button>
                </form>
                <p className="mt-4 text-lg">
                    Don't have an account?{" "}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => navigate("/signUp")}
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;
