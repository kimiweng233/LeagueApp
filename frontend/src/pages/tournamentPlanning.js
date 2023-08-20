import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { AiOutlinePlus } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { BsClock } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";

import LoadingScreen from "../components/Utilities/loadingScreen";
import LoadingAnimation from "../components/Utilities/loadingAnimation";
import ErrorText from "../components/Utilities/errorText";
import CustomAlert from "../components/Utilities/customAlert";

import { dateConversion } from "../utilities/dateConversion";
import services from "../services";

import "../assets/css/tournamentsList.css";

function TournamentPlanning() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [teamName, setTeamName] = useState("");
    const [teamAcronym, setTeamAcronym] = useState("");

    const [pendingTeams, setPendingTeams] = useState([]);
    const [omittedTeams, setOmittedTeams] = useState(new Set());
    const [showNewTeamForm, setShowNewTeamForm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const startTimeRef = useRef();
    const teamsCapRef = useRef();
    const prizePoolRef = useRef();
    const registrationFeeRef = useRef();
    const liveLinkRef = useRef();

    const {
        data: tournamentData,
        isLoading: isTournamentDataLoading,
        fetchStatus: tournamentDataFetchStatus,
        isError: tournamentDataError,
    } = useQuery({
        queryKey: ["tournament", searchParams.get("tournamentID")],
        queryFn: async () =>
            services.getTournamentData({
                tournamentID: searchParams.get("tournamentID"),
                summonerID: localStorage.getItem("summonerID"),
            }),
        retry: false,
    });

    console.log(tournamentData);

    const tournamentDataLoading =
        isTournamentDataLoading && tournamentDataFetchStatus !== "idle";

    const { mutate: saveTeamSettings, isLoading: saveTeamSettingsLoading } =
        useMutation({
            mutationFn: () =>
                services.updateTournamentTeams({
                    tournamentID: searchParams.get("tournamentID"),
                    teamData: pendingTeams,
                }),
            onSuccess: (data) => {
                queryClient.setQueryData(
                    ["tournament", searchParams.get("tournamentID")],
                    {
                        ...tournamentData,
                        teams: data.teams,
                    }
                );
                if (data.omitted.length > 0) {
                    setShowAlert(true);
                    setAlertMessage(
                        "teams " +
                            data.omitted.join(", ") +
                            " were ommited because of duplicated name/acronym"
                    );
                }
                setPendingTeams([]);
            },
            onError: (error) => {
                setShowAlert(true);
                setAlertMessage(error.response.data);
            },
        });

    const handleSaveTeamSettings = (event) => {
        event.preventDefault();
        saveTeamSettings();
    };

    const { mutate: startTournament, isLoading: startTournamentLoading } =
        useMutation({
            mutationFn: () =>
                services.startTournament({
                    tournamentID: searchParams.get("tournamentID"),
                    omittedTeams: Array.from(omittedTeams),
                }),
            onSuccess: () => {
                navigate(
                    `/tournamentDashboard?tournamentID=${searchParams.get(
                        "tournamentID"
                    )}`
                );
            },
            onError: (error) => {
                setShowAlert(true);
                setAlertMessage(error.response.data);
            },
        });

    const {
        mutate: updateTournamentData,
        isLoading: updateTournamentDataLoading,
    } = useMutation({
        mutationFn: () =>
            services.updateTournamentData({
                tournamentID: searchParams.get("tournamentID"),
                startTime: startTimeRef.current.value,
                teamsCap: teamsCapRef.current.value,
                prizePool: prizePoolRef.current.value,
                registrationFee: registrationFeeRef.current.value,
                liveLink: liveLinkRef.current.value,
            }),
        onSuccess: (data) => {
            queryClient.setQueryData(
                ["tournament", searchParams.get("tournamentID")],
                {
                    ...tournamentData,
                    startTime: startTimeRef.current.value,
                    teamsCap: teamsCapRef.current.value,
                    prizePool: prizePoolRef.current.value,
                    registrationFee: registrationFeeRef.current.value,
                    liveLink: liveLinkRef.current.value,
                }
            );
        },
        onError: (error) => {
            setAlertMessage(error.response.data);
            setShowAlert(true);
        },
    });

    const handleSavingTournamentChanges = (event) => {
        event.preventDefault();
        updateTournamentData();
    };

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

    const createNewTeam = (event) => {
        event.preventDefault();
        if (
            teamName != "" &&
            teamAcronym != "" &&
            pendingTeams.find(
                (team) => team[0] == teamName || team[1] == teamAcronym
            ) == undefined
        ) {
            let newTeam = [teamName, teamAcronym];
            setPendingTeams([...pendingTeams, newTeam]);
            setTeamName("");
            setTeamAcronym("");
        }
    };

    if (tournamentDataLoading) {
        return (
            <div>
                <LoadingAnimation />
            </div>
        );
    }

    if (tournamentDataError) {
        return (
            <ErrorText>
                Error fetching tournament data, please try refreshing!
            </ErrorText>
        );
    }

    if (tournamentData.started) {
        return (
            <ErrorText>
                Tournament has started, please visit the tournament page.
            </ErrorText>
        );
    }

    return (
        <div className="tournamentMenuWrapper">
            {(saveTeamSettingsLoading ||
                startTournamentLoading ||
                updateTournamentDataLoading) && <LoadingScreen />}
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
                <h1 className="tournamentFormSectionTitleBlue">
                    {tournamentData.tournamentName}
                </h1>
                <div className="tournamentFormSectionTitleDividerBarsBlueRight" />
            </div>
            <div className="tournamentMenu tournamentPlanningWrapper">
                <form>
                    <div className="tournamentPlanningInputRow">
                        <div className="tournamentPlanningLabelInputWrapper formInputFieldLabel">
                            <BsClock className="clockIcon" />
                            <input
                                type="datetime-local"
                                defaultValue={dateConversion(
                                    tournamentData.startTime
                                )}
                                className="formInputField"
                                ref={startTimeRef}
                            />
                        </div>
                        <div className="tournamentPlanningLabelInputWrapper">
                            <h2 className="formInputFieldLabel"># Teams:</h2>
                            <input
                                type="number"
                                defaultValue={tournamentData.teamsCap}
                                className="formInputField"
                                ref={teamsCapRef}
                            />
                        </div>
                    </div>
                    <div className="tournamentPlanningInputRow">
                        <div className="tournamentPlanningLabelInputWrapper">
                            <h2 className="formInputFieldLabel">Prize Pool:</h2>
                            <input
                                type="number"
                                defaultValue={tournamentData.prizePool}
                                className="formInputField"
                                ref={prizePoolRef}
                            />
                        </div>
                        <div className="tournamentPlanningLabelInputWrapper">
                            <h2 className="formInputFieldLabel">
                                Registration Fee:
                            </h2>
                            <input
                                type="number"
                                defaultValue={tournamentData.registrationFee}
                                className="formInputField"
                                ref={registrationFeeRef}
                            />
                        </div>
                    </div>
                    <div className="tournamentPlanningInputRow">
                        <div className="labelInputWrapper">
                            <h2 className="formInputFieldLabel">
                                Broadcast Link:
                            </h2>
                            <input
                                type="text"
                                defaultValue={tournamentData.liveLink}
                                className="formInputField"
                                ref={liveLinkRef}
                            />
                        </div>
                        <button
                            className="tournamentPlanningSaveButton"
                            onClick={(event) =>
                                handleSavingTournamentChanges(event)
                            }
                        >
                            Save
                        </button>
                    </div>
                    <div className="tournamentPlanningTableTitleWrapper">
                        <h2 className="formInputFieldLabel noMargin">Teams</h2>
                        <AiOutlinePlus
                            className="formInputFieldPlusButton"
                            onClick={() => {
                                setShowNewTeamForm(true);
                            }}
                        />
                    </div>
                    <div className="formInfoBackground tournamentPlanningTableWrapper">
                        <table className="tournamentPlanningTable">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Count</th>
                                    <th>Join Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className="tournamentPlanningDividerColumn">
                                        <div className="tournamentPlanningTableDivider" />
                                    </th>
                                </tr>
                                {showNewTeamForm && (
                                    <tr>
                                        <th>
                                            <input
                                                className="tournamentPlanningteamInput"
                                                placeholder="Team Name"
                                                value={teamName}
                                                onChange={(e) =>
                                                    handleTeamName(
                                                        e.target.value
                                                    )
                                                }
                                            ></input>
                                        </th>
                                        <th>
                                            <input
                                                className="tournamentPlanningteamInput"
                                                placeholder="Team Acronym"
                                                value={teamAcronym}
                                                onChange={(e) =>
                                                    handleTeamAcronym(
                                                        e.target.value
                                                    )
                                                }
                                            ></input>
                                        </th>
                                        <th>
                                            <div className="tournamentPlanningButtonsRow">
                                                <button
                                                    className="tournamentPlanningButton tournamentPlanningCreateButton"
                                                    onClick={(event) =>
                                                        createNewTeam(event)
                                                    }
                                                >
                                                    Create
                                                </button>
                                                <button
                                                    className="tournamentPlanningButton tournamentPlanningCancelButton"
                                                    onClick={() => {
                                                        setTeamName("");
                                                        setTeamAcronym("");
                                                        setShowNewTeamForm(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </th>
                                    </tr>
                                )}
                                {pendingTeams.map((team, i) => (
                                    <tr key={i}>
                                        <th>
                                            {team[0]} ({team[1]}){" "}
                                            <p className="tournamentPlanningPendingText">
                                                &nbsp; pending
                                            </p>
                                        </th>
                                        <th>
                                            <p className="tournamentPlanningPendingText">
                                                pending
                                            </p>
                                        </th>
                                        <th>
                                            <ImCross
                                                className="tournamentPlanningCrossButton"
                                                onClick={() => {
                                                    setPendingTeams(
                                                        [...pendingTeams]
                                                            .slice(0, i)
                                                            .concat(
                                                                pendingTeams.slice(
                                                                    i + 1
                                                                )
                                                            )
                                                    );
                                                }}
                                            />
                                        </th>
                                    </tr>
                                ))}
                                {tournamentData.teams.map((team, i) => (
                                    <tr key={i}>
                                        <th
                                            className={
                                                omittedTeams.has(team.teamName)
                                                    ? "deletingTeamFont"
                                                    : ""
                                            }
                                        >
                                            {team.teamName} ({team.teamAcronym})
                                        </th>
                                        <th
                                            className={
                                                omittedTeams.has(team.teamName)
                                                    ? "deletingTeamFont"
                                                    : ""
                                            }
                                        >
                                            {team.membersCount}
                                        </th>
                                        <th>
                                            {!omittedTeams.has(
                                                team.teamName
                                            ) ? (
                                                <ImCross
                                                    className="tournamentPlanningCrossButton"
                                                    onClick={() => {
                                                        const updatedSet =
                                                            new Set(
                                                                omittedTeams
                                                            );
                                                        updatedSet.add(
                                                            team.teamName
                                                        );
                                                        setOmittedTeams(
                                                            updatedSet
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <FaArrowLeft
                                                    className="tournamentPlanningAdmitButton"
                                                    onClick={() => {
                                                        const updatedSet =
                                                            new Set(
                                                                omittedTeams
                                                            );
                                                        updatedSet.delete(
                                                            team.teamName
                                                        );
                                                        setOmittedTeams(
                                                            updatedSet
                                                        );
                                                    }}
                                                />
                                            )}
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="tournamentPlanningSaveTeamSettingsButtonWrapper">
                        <button
                            className="tournamentPlanningSaveTeamSettingsButton tournamentFormSectionTitleBlue"
                            onClick={(event) => handleSaveTeamSettings(event)}
                        >
                            Save
                        </button>
                    </div>
                </form>
                <div className="tournamentPlanningStartTournamentButton">
                    <button
                        className={`joinedTeamsSubmitButton submitButtonUnlocked quickJoinButton blueTextHalo`}
                        onClick={startTournament}
                    >
                        Start Tournament
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TournamentPlanning;
