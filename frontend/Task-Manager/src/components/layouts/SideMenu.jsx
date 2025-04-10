import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);

    const [sideMenuData, setSideMenuData] = useState([]);

    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === "logout") {
            handleLogout();
            return;
        }

        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    useEffect(() => {
        if (user) {
            setSideMenuData(user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
        } else {
            setSideMenuData([]);
        }
    }, [user]);

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top[61px] z-999">
            <div className="flex flex-col items-center justify-center mb-7 pt-5">
                <div className="relative">
                    <img
                        src={user?.profileImageUrl || ""}
                        alt="Profile Image"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                </div>

                {user?.role === "admin" && (
                    <div className="text-[12px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
                        Admin
                    </div>
                )}

                <h5 className="text-[18px] text-gray-950 font-bold leading-6 mt-3">{user?.name || ""}</h5>

                <p className="text-[14px] text-gray-600 mb-4">{user?.email || ""}</p>

                {sideMenuData.map((item, index) => {
                    return (
                        <button
                            key={`menu_${index}`}
                            className={`w-full flex items-center gap-4 text-[16px] ${
                                activeMenu == item.label
                                    ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
                                    : ""
                            } py-3 px-6 mb-3 cursor-pointer`}
                            onClick={() => handleClick(item.path)}
                        >
                            <item.icon className="text-xl" />
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SideMenu;
