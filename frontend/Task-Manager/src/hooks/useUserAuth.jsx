import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const useUserAuth = () => {
    const { user, loading, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading || user) return;

        if (!user) {
            clearUser();
            navigate("/login", { replace: true });
        }
    }, [user, loading, clearUser, navigate]);
};

export default useUserAuth;
