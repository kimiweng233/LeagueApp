import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import services from "../services";
import LoginGuard from "../components/Utilities/loginGuard";

import { BsClock } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";

import "../assets/css/tournamentCreationForm.css";

function TournamentForm() {
    const [tournamentName, setTournamentName] = useState("");
    const [tournamentFormat, setTournamentFormat] = useState("5v5");
    const [description, setDescription] = useState("");
    const [teamsCap, setTeamsCap] = useState("");
    const [prizePool, setPrizePool] = useState("");
    const [registrationFee, setRegistrationFee] = useState("");
    const [liveBroadcastLink, setLiveBroadcastLink] = useState("");
    const [startTime, setStartTime] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        services
            .createTournament({
                tournamentName: tournamentName,
                tournamentFormat: tournamentFormat,
                description: description,
                teamsCap: teamsCap,
                prizePool: prizePool,
                registrationFee: registrationFee,
                liveLink: liveBroadcastLink,
                startTime: startTime,
                teams: [],
            })
            .then((response) => {
                navigate("/tournaments");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const isFormValid =
        tournamentName && teamsCap && prizePool && registrationFee && startTime;

    return (
        <div className="formWrapper">
            <div className="tournamentFormTitleSectionWrapper">
                <div className="tournamentFormSectionTitleDividerBarsBlueLeft" />
                <h1 className="tournamentFormSectionTitleBlue">
                    Create Tournament
                </h1>
                <div className="tournamentFormSectionTitleDividerBarsBlueRight" />
            </div>
            <form onSubmit={handleSubmit} className="tournamentForm">
                <div className="inputRowWrapper formTitleFieldWrapper">
                    <div className="labelInputWrapper">
                        <h2 className="tournamentNameTitle">
                            Tournament Name:
                        </h2>
                        <input
                            type="text"
                            value={tournamentName}
                            onChange={(e) => setTournamentName(e.target.value)}
                            className="formInputField formTitleInputField"
                        />
                    </div>
                </div>
                <div className="inputRowWrapper formInfoBackground">
                    <div className="tournamentFormDetails">
                        <div className="labelInputWrapper">
                            <h2 className="formInputFieldLabel">Format:</h2>
                            <select
                                className="formInputField"
                                value={tournamentFormat}
                                onChange={(e) =>
                                    setTournamentFormat(e.target.value)
                                }
                            >
                                <option value="5v5">5v5</option>
                                <option value="1v1">1v1</option>
                            </select>
                        </div>
                        <div className="labelInputWrapper formInputFieldLabel">
                            <BsClock className="clockIcon" />
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="formInputField"
                            />
                        </div>
                        <div className="labelInputWrapper">
                            <h2 className="formInputFieldLabel"># Teams:</h2>
                            <input
                                type="number"
                                value={teamsCap}
                                onChange={(e) => setTeamsCap(e.target.value)}
                                className="formInputField"
                            />
                        </div>
                        <div className="labelInputWrapper">
                            <h2 className="formInputFieldLabel">Prize Pool:</h2>
                            <input
                                type="number"
                                value={prizePool}
                                onChange={(e) => setPrizePool(e.target.value)}
                                className="formInputField"
                            />
                        </div>
                        <div className="labelInputWrapper">
                            <h2 className="formInputFieldLabel">
                                Registration Fee:
                            </h2>
                            <input
                                type="number"
                                value={registrationFee}
                                onChange={(e) => {
                                    setRegistrationFee(e.target.value);
                                }}
                                className="formInputField"
                            />
                        </div>
                        <div className="labelInputWrapper">
                            <h2 className="formInputFieldLabel">
                                Broadcast Link:
                            </h2>
                            <input
                                type="text"
                                value={liveBroadcastLink}
                                onChange={(e) => {
                                    setLiveBroadcastLink(e.target.value);
                                }}
                                className="formInputField"
                            />
                        </div>
                    </div>
                    <div className="tournamentFormDescriptionWrapper">
                        <h2 className="formInputFieldLabel">Description:</h2>
                        <textarea
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="tournamentFormDescription formInputField"
                        />
                    </div>
                </div>
                <div className="buttonRowWrapper">
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`submitButton ${
                            isFormValid
                                ? "submitButtonUnlocked"
                                : "submitButtonLocked"
                        }`}
                    >
                        <p className="plusIcon">+</p>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginGuard(TournamentForm);
