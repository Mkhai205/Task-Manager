import React from "react";
import UI_IMG from "../../assets/images/auth_img.jpg";
import BG_IMG from "../../assets/images/bg_auth_img.jpg";

const AuthLayout = ({ children }) => {
    return (
        <div
            className="flex bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${BG_IMG})` }}
        >
            <div className="w-screen h-screen md:w-[60vw] px:12 pt-8 pb-12">
                {/* <h2 className="text-2xl font-semibold text-center mb-4">Task Manager</h2> */}
                {children}
            </div>

            <div className="hidden md:flex w-[40vw] h-screen items-center justify-center overflow-hidden">
                <img src={UI_IMG} alt="Auth_img" className="w-full h-full object-cover shadow-lg" />
            </div>
        </div>
    );
};

export default AuthLayout;
