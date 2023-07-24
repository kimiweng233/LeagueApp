import Alert from "react-bootstrap/Alert";

import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import services from "../services";

import OpenTeam from "../components/Teams Display/openTeam";
import LoginGuard from "../components/Utilities/loginGuard";
import LoadingAnimation from "../components/Utilities/loadingAnimation";

import { GrPowerReset } from "react-icons/gr";

import TopImage from "../assets/Positions/Position_Challenger-Top.png";
import JungleImage from "../assets/Positions/Position_Challenger-Jungle.png";
import MidImage from "../assets/Positions/Position_Challenger-Mid.png";
import BotImage from "../assets/Positions/Position_Challenger-Bot.png";
import SuppImage from "../assets/Positions/Position_Challenger-Support.png";
import TopImageUnselected from "../assets/Positions/Position_Iron-Top.png";
import JungleImageUnselected from "../assets/Positions/Position_Iron-Jungle.png";
import MidImageUnselected from "../assets/Positions/Position_Iron-Mid.png";
import BotImageUnselected from "../assets/Positions/Position_Iron-Bot.png";
import SuppImageUnselected from "../assets/Positions/Position_Iron-Support.png";

import "../assets/css/teamsList.css";

function Test() {
    const [roleQueries, setRoleQueries] = useState([
        "Top",
        "Jungle",
        "Mid",
        "Bot",
        "Support",
    ]);
    const [inviteCode, setInviteCode] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { data: teamsList, isLoading: isTeamsListLoading } = useQuery({
        queryKey: ["teams-list", searchParams.get("tournamentID")],
        queryFn: async () =>
            services.getTeamsWithVacancy({
                tournamentID: searchParams.get("tournamentID"),
                desiredRoles: roleQueries,
            }),
        retry: false,
    });

    const {
        data: tournamentJoinStatus,
        isLoading: isTournamentJoinStatusLoading,
    } = useQuery({
        queryKey: ["tournament-join-status", searchParams.get("tournamentID")],
        queryFn: async () =>
            services.checkIfJoinedTournament({
                summonerID: localStorage.getItem("summonerID"),
                tournamentID: searchParams.get("tournamentID"),
            }),
        retry: false,
    });

    const changeRoleQuery = (changingRole) => {
        let updatedRoles = [];
        if (roleQueries.includes(changingRole)) {
            updatedRoles = roleQueries.filter((role) => role !== changingRole);
        } else {
            updatedRoles = [...roleQueries, changingRole];
        }
        setRoleQueries(updatedRoles);
    };

    const quickJoin = () => {
        services
            .quickJoin({
                summonerID: localStorage.getItem("summonerID"),
                tournamentID: searchParams.get("tournamentID"),
            })
            .then((response) => {
                if (response.data["message"] == "Joined Team") {
                    navigate(`/team?teamID=${response.data["id"]}`);
                } else if (response.data["message"] == "Created Team") {
                    navigate(`/team?teamID=${response.data["id"]}`);
                } else if (response.data["message"] == "Sent Requests") {
                    setShowAlert(true);
                }
            });
    };

    const resetRoleQuery = () => {
        setRoleQueries(["Top", "Jungle", "Mid", "Bot", "Support"]);
    };

    const filteredTeamsList = teamsList?.filter((team) => {
        if (team.inviteCode == inviteCode) {
            return true;
        }
        if (team.teamJoiningMode == "invite-only") {
            return false;
        }
        if (inviteCode == "") {
            for (let i = 0; i < roleQueries.length; i++) {
                if (team.rolesFilled[roleQueries[i]] === null) {
                    return true;
                }
            }
        }
        return false;
    });

    return (
        <div className="teamsListWrapper">
            {showAlert && (
                <Alert
                    variant="success"
                    dismissible
                    onClose={() => setShowAlert(false)}
                >
                    You are on the queue and will be joined as soon as a team
                    opens up!
                </Alert>
            )}
            <div className="tournamentFormTitleSectionWrapper">
                <div className="tournamentFormSectionTitleDividerBarsBlueLeft" />
                <h1 className="tournamentFormSectionTitleBlue">Open Teams</h1>
                <div className="tournamentFormSectionTitleDividerBarsBlueRight" />
            </div>
            <div className="FilterWrapper">
                <div className="subFilterWrapper">
                    <h3 className="filterLabel">Room Code</h3>
                    <input
                        name="inviteCodeSearchBar"
                        className="inviteCodeSearchBar"
                        value={inviteCode}
                        onChange={(e) => {
                            if (e.target.value.length <= 6) {
                                setInviteCode(e.target.value);
                            }
                        }}
                    />
                </div>
                <div className="filterDetailsWrapper">
                    <div className="positionsFilterWrapper">
                        <h3 className="filterLabel">Filter by Roles</h3>
                        <div className="RolesQueryIcons">
                            <img
                                className="roleIconImg"
                                src={
                                    roleQueries.includes("Top")
                                        ? TopImage
                                        : TopImageUnselected
                                }
                                onClick={() => changeRoleQuery("Top")}
                            />
                            <img
                                className="roleIconImg"
                                src={
                                    roleQueries.includes("Jungle")
                                        ? JungleImage
                                        : JungleImageUnselected
                                }
                                onClick={() => changeRoleQuery("Jungle")}
                            />
                            <img
                                className="roleIconImg"
                                src={
                                    roleQueries.includes("Mid")
                                        ? MidImage
                                        : MidImageUnselected
                                }
                                onClick={() => changeRoleQuery("Mid")}
                            />
                            <img
                                className="roleIconImg"
                                src={
                                    roleQueries.includes("Bot")
                                        ? BotImage
                                        : BotImageUnselected
                                }
                                onClick={() => changeRoleQuery("Bot")}
                            />
                            <img
                                className="roleIconImg"
                                src={
                                    roleQueries.includes("Support")
                                        ? SuppImage
                                        : SuppImageUnselected
                                }
                                onClick={() => changeRoleQuery("Support")}
                            />
                        </div>
                        <div className="resetRolesQueryButtonWrapper">
                            <GrPowerReset
                                className="resetRolesQueryButton"
                                onClick={resetRoleQuery}
                            />
                        </div>
                    </div>
                    <div className="quickJoinFilterWrapper">
                        <button
                            className="joinedTeamsSubmitButton submitButtonUnlocked quickJoinButton blueTextHalo"
                            onClick={quickJoin}
                        >
                            Quick Join
                        </button>
                    </div>
                </div>
            </div>
            {isTeamsListLoading || isTournamentJoinStatusLoading ? (
                <LoadingAnimation />
            ) : (
                <div className="openTeamsWrapper">
                    {filteredTeamsList?.length > 0 ? (
                        filteredTeamsList?.map((team, i) => {
                            return (
                                <OpenTeam
                                    key={i}
                                    {...team}
                                    tournamentJoinStatus={tournamentJoinStatus}
                                />
                            );
                        })
                    ) : (
                        <h1 className="NoMatchesSign">No Matches Found QAQ</h1>
                    )}
                </div>
            )}
        </div>
    );
}

export default LoginGuard(Test);
