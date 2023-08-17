import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import LoadingScreen from "../components/Utilities/loadingScreen";
import CustomAlert from "../components/Utilities/customAlert";

import services from "../services";

import "../assets/css/loginForm.css";

function LeagueLogin() {
    const [summonerID, setSummonerID] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("summonerID") !== null) {
            navigate("/");
        }
    }, [navigate]);

    const login = (event) => {
        event.preventDefault();
        mutate();
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: () => services.summonerLogin({ summonerID: summonerID }),
        onSuccess: (summonerData) => {
            localStorage.setItem("summonerID", summonerID);
            localStorage.setItem("role", summonerData);
            navigate(location?.state?.prevUrl ? location?.state?.prevUrl : "/");
        },
        onError: (error) => {
            setAlertMessage(error.response.data);
            setShowAlert(true);
        },
    });

    const handleChange = (event) => {
        setSummonerID(event.target.value.slice(0, 16));
    };

    return (
        <div className="formWrapper">
            {isLoading && <LoadingScreen />}
            {showAlert && (
                <CustomAlert
                    alertType="danger"
                    setShowAlert={() => setShowAlert(false)}
                >
                    {alertMessage}
                </CustomAlert>
            )}
            <div className="tournamentFormTitleSectionWrapper">
                <div className="tournamentFormSectionTitleDividerBarsBlueLeft" />
                <h1 className="tournamentFormSectionTitleBlue">Link Account</h1>
                <div className="tournamentFormSectionTitleDividerBarsBlueRight" />
            </div>
            <form
                onSubmit={(e) => login(e)}
                className="tournamentForm loginForm"
            >
                <div className="loginInputWrapper">
                    <h2 className="formInputFieldLabel textNoButtomMargin">
                        Summoner Name
                    </h2>
                    <input
                        type="text"
                        value={summonerID}
                        maxLength={16}
                        onChange={handleChange}
                        className="formInputField formTitleInputField"
                    />
                    <button
                        type="submit"
                        disabled={!summonerID}
                        className={`linkAccountButtonBase ${
                            summonerID
                                ? "linkAccountButton"
                                : "linkAccountButtonLocked"
                        }`}
                    >
                        Link
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LeagueLogin;
