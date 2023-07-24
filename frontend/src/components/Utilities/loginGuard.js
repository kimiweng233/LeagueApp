import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginGuard = (Component) => {
    function WrappedComponent(props) {
        const navigate = useNavigate();

        useEffect(() => {
            if (localStorage.getItem("summonerID") === null) {
                navigate("/linkAccount");
            }
        }, [navigate]);

        return <Component />;
    }
    return WrappedComponent;
};
export default LoginGuard;
