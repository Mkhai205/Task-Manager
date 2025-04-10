import { useContext } from "react";
import { UserContext } from "../../context/userContext.jsx";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="fixed w-full h-screen overflow-hidden">
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className="flex h-full">
                    <div className="max-[1080px]:hidden">
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    {/* Allow scrolling for the main content */}
                    <div className="grow mx-5 mb-18 overflow-auto">{children}</div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
