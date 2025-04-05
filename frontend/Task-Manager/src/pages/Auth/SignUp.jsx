import { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail, validatePassword } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext.jsx";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminInviteToken, setAdminInviteToken] = useState("");

    const [error, setError] = useState(null);

    let profileImageUrl = ""; // Initialize profileImageUrl

    const navigate = useNavigate();

    const { updateUser } = useContext(UserContext); // Import the context to update user data

    // Handle SignUp Form Submit
    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!fullName) {
            setError("Please enter your full name");
            return;
        }

        if (!validateEmail(email)) {
            setError("Invalid email address");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setError(""); // Clear any previous error

        // SignUp API Call
        try {
            // Upload profile picture if selected
            if(profilePicture) {
                const imgUploadResponse = await uploadImage(profilePicture); 
                profileImageUrl = imgUploadResponse.data || "";
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                name: fullName,
                email,
                password,
                profileImageUrl,
                adminInviteToken,
            });

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
            <div className="lg:w-[80%] h-auto md:h-full flex flex-col items-center justify-center m-auto bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-center mb-4">Create an Account</h3>
                <p className="text-gray-600 text-lg mb-4 text-center">
                    Join us today by entering your details below.
                </p>

                <form
                    onSubmit={handleSignUp}
                    className="w-full flex flex-col items-center gap-6 px-6"
                >
                    <ProfilePhotoSelector image={profilePicture} setImage={setProfilePicture} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            label="Full Name"
                            placeholder="John Doe"
                            type="text"
                        />

                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email Address"
                            placeholder="abc@gmail.com"
                            type="email"
                        />

                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            placeholder="Min 8 characters"
                            type="password"
                        />

                        <Input
                            value={adminInviteToken}
                            onChange={(e) => setAdminInviteToken(e.target.value)}
                            label="Admin Invite Token"
                            placeholder="6-digit token"
                            type="text"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full max-w-full bg-blue-500 text-white mt-3 mb-3 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-lg">
                    Already an account?{" "}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignUp;
