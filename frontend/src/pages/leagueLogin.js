import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import LoadingScreen from "../components/Utilities/loadingScreen";

import services from "../services";

import Alert from "react-bootstrap/Alert";

import "../assets/css/loginForm.css";

function LeagueLogin() {
    const [showAlert, setShowAlert] = useState(false);
    const [summonerID, setSummonerID] = useState("");
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

    const { mutate, isLoading, error } = useMutation({
        mutationFn: () => services.summonerLogin({ summonerID: summonerID }),
        onSuccess: () => {
            localStorage.setItem("summonerID", summonerID);
            window.location.href = "/";
        },
        onError: (error) => {
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
                <Alert
                    variant="success"
                    dismissible
                    onClose={() => setShowAlert(false)}
                >
                    {error.response.data}
                </Alert>
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
