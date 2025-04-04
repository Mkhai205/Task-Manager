import { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input.jsx";
import { validateEmail, validatePassword } from "../../utils/helper.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Handle Login Form Submit
    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)) {
            setError("Invalid email address");
            return;
        }

        if(!validatePassword(password)) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setError(""); // Clear any previous error

        // Login API Call
    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col items-center justify-center m-auto bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-center mb-4">Welcome back</h3>
                <p className="text-gray-600 text-lg mb-4 text-center">
                    Please enter your credentials to access your account.
                </p>
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
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
                        className="w-[80%] m-auto mt-3 mb-3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        LOGIN
                    </button>
                </form>
                <p className="mt-4 text-lg">
                    Don't have an account?{" "}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;
