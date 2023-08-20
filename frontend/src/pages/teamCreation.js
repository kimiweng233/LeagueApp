import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";

import { generateInviteCode } from "../utilities/inviteCode";
import LoginGuard from "../components/Utilities/loginGuard";
import CustomAlert from "../components/Utilities/customAlert";
import LoadingScreen from "../components/Utilities/loadingScreen";

import services from "../services";

import "../assets/css/teamCreationForm.css";

function TeamForm() {
    const [teamName, setTeamName] = useState("");
    const [teamAcronym, setTeamAcronym] = useState("");
    const [teamJoiningMode, setTeamJoiningMode] = useState("public");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { mutate: createTeam, isLoading } = useMutation({
        mutationFn: () =>
            services.createTeam({
                teamData: {
                    teamName: teamName,
                    teamAcronym: teamAcronym,
                    tournament: searchParams.get("tournamentID"),
                    teamJoiningMode: teamJoiningMode,
                    rolesFilled: {
                        Top: null,
                        Jungle: null,
                        Mid: null,
                        Bot: null,
                        Support: null,
                    },
                    inviteCode: generateInviteCode(6),
                    members: [],
                },
                summonerID: localStorage.getItem("summonerID"),
            }),
        onSuccess: (data) => {
            navigate(`/team?teamID=${data}`);
        },
        onError: (error) => {
            setAlertMessage(error.response.data);
            setShowAlert(true);
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        createTeam();
    };

    useEffect(() => {}, [teamJoiningMode]);

    const isFormValid = teamName && teamAcronym;

    const handleTeamName = (teamName) => {
        teamName = teamName.replace(/[^a-zA-Z0-9\s]/g, "");
        teamName = teamName.slice(0, 20);
        setTeamName(teamName);
    };

    const handleTeamAcronym = (acronym) => {
        acronym = acronym.replace(/[^a-zA-Z0-9]/g, "");
        acronym = acronym.slice(0, 3);
        acronym = acronym.toUpperCase();
        setTeamAcronym(acronym);
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
                <h1 className="tournamentFormSectionTitleBlue">Create Team</h1>
                <div className="tournamentFormSectionTitleDividerBarsBlueRight" />
            </div>
            <form onSubmit={handleSubmit} className="tournamentForm">
                <div className="teamCreationInputRowWrapper">
                    <h1 className="teamCreationTitleLabel ">Team Name:</h1>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => handleTeamName(e.target.value)}
                        className="formInputField teamCreationTitleInput"
                    />
                    <input
                        type="text"
                        value={teamAcronym}
                        onChange={(e) => handleTeamAcronym(e.target.value)}
                        className="formInputField teamCreationAcronymInput"
                    />
                </div>
                <div className="teamCreationInputRowWrapper">
                    <div className="teamCreationButtonSet">
                        <button
                            type="button"
                            onClick={() => setTeamJoiningMode("public")}
                            className={`${
                                teamJoiningMode == "public"
                                    ? "teamCreationButtonClicked"
                                    : "teamCreationButtonUnclicked"
                            } teamCreationInputButton teamCreationInputLeftButton teamCreationButtonLeft ${
                                teamJoiningMode == "public" &&
                                "teamCreationLeftButtonRightHighlight"
                            }`}
                        >
                            Public
                        </button>
                        <button
                            type="button"
                            onClick={() => setTeamJoiningMode("request-only")}
                            className={`${
                                teamJoiningMode == "request-only"
                                    ? "teamCreationButtonClicked"
                                    : "teamCreationButtonUnclicked"
                            } teamCreationInputButton teamCreationInputCenterButton ${
                                teamJoiningMode == "request-only" &&
                                "teamCreationCenterButtonRightHighlight"
                            } ${
                                teamJoiningMode == "public" &&
                                "teamCreationCenterButtonLeftHighlight"
                            }`}
                        >
                            Request-Only
                        </button>
                        <button
                            type="button"
                            onClick={() => setTeamJoiningMode("invite-only")}
                            className={`${
                                teamJoiningMode == "invite-only"
                                    ? "teamCreationButtonClicked"
                                    : "teamCreationButtonUnclicked"
                            } teamCreationInputButton teamCreationInputRightButton ${
                                teamJoiningMode == "request-only" &&
                                "teamCreationRightButtonLeftHighlight"
                            }`}
                        >
                            Invite-Only
                        </button>
                    </div>
                    <div className="teamCreationFormButtonRowWrapper">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`submitButton submitButtonSquare ${
                                isFormValid
                                    ? "submitButtonUnlocked"
                                    : "submitButtonLocked"
                            }`}
                        >
                            <p className="plusIcon">+</p>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginGuard(TeamForm);
