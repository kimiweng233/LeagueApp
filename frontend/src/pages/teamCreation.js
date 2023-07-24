import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import services from "../services";
import { generateInviteCode } from "../utilities/inviteCode";
import LoginGuard from "../components/Utilities/loginGuard";

import "../assets/css/teamCreationForm.css";

function TeamForm() {
    const [teamName, setTeamName] = useState("");
    const [teamAcronym, setTeamAcronym] = useState("");
    const [teamJoiningMode, setTeamJoiningMode] = useState("public");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        services
            .createTeam({
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
            })
            .then((response) => {
                navigate(`/team?teamID=${response.data["id"]}`);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {}, [teamJoiningMode]);

    const isFormValid = teamName && teamAcronym;

    const handleTeamAcronym = (acronym) => {
        acronym = acronym.replace(/[^a-zA-Z0-9]/g, "");
        acronym = acronym.slice(0, 3);
        acronym = acronym.toUpperCase();
        setTeamAcronym(acronym);
    };

    return (
        <div className="formWrapper">
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
                        onChange={(e) => setTeamName(e.target.value)}
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
