import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const LoginGuard = (Component) => {
    function WrappedComponent(props) {
        const location = useLocation();
        return localStorage.getItem("summonerID") ? (
            <Component />
        ) : (
            <Navigate
                to="/linkAccount"
                state={{ prevUrl: `${location.pathname}${location.search}` }}
            />
        );
    }
    return WrappedComponent;
};
export default LoginGuard;
