import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";

import services from "../services";

import { Tooltip } from "react-tooltip";

import TeamCardTemp from "../components/Teams Display/openTeamTemp";
import LoginGuard from "../components/Utilities/loginGuard";
import LoadingAnimation from "../components/Utilities/loadingAnimation";
import LoadingScreen from "../components/Utilities/loadingScreen";
import ErrorText from "../components/Utilities/errorText";
import CustomAlert from "../components/Utilities/customAlert";

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

function TeamsList() {
    const queryClient = useQueryClient();

    const [roleQueries, setRoleQueries] = useState([
        "Top",
        "Jungle",
        "Mid",
        "Bot",
        "Support",
    ]);
    const [inviteCode, setInviteCode] = useState("");
    const [inQueue, setInQueue] = useState(false);

    const [showGoodAlert, setShowGoodAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const NUM_TEAMS_PER_PAGE = 5;

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
        useInfiniteQuery(
            ["teams-list", searchParams.get("tournamentID")],
            ({ pageParam = 1 }) =>
                services.getTeamsWithVacancyPaginated({
                    tournamentID: searchParams.get("tournamentID"),
                    desiredRoles: roleQueries,
                    perPage: NUM_TEAMS_PER_PAGE,
                    pageNum: pageParam,
                }),
            {
                getNextPageParam: (lastPage, allPages) => {
                    return lastPage?.isLastPage
                        ? undefined
                        : allPages.length + 1;
                },
            }
        );

    const {
        data: tournamentData,
        isLoading: isTournamentDataLoading,
        isError: tournamentDataError,
    } = useQuery({
        queryKey: ["tournament", searchParams.get("tournamentID")],
        queryFn: async () =>
            services.getTournamentData({
                tournamentID: searchParams.get("tournamentID"),
                summonerID: localStorage.getItem("summonerID"),
            }),
        onSuccess: (tournamentData) => {
            setInQueue(
                tournamentData.quickJoinQueue.some(
                    (summonerID) =>
                        summonerID == localStorage.getItem("summonerID")
                )
            );
        },
        retry: false,
    });

    const {
        data: tournamentJoinStatus,
        isLoading: isTournamentJoinStatusLoading,
        isError: tournamentJoinStatusError,
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

    const { mutate: quickJoin, isLoading: quickJoinLoading } = useMutation({
        mutationFn: () =>
            services.quickJoin({
                summonerID: localStorage.getItem("summonerID"),
                tournamentID: searchParams.get("tournamentID"),
            }),
        onSuccess: (data) => {
            if (data["message"] == "Joined Team") {
                navigate(`/team?teamID=${data["id"]}`);
            } else if (data["message"] == "Created Team") {
                navigate(`/team?teamID=${data["id"]}`);
            } else if (data["message"] == "Sent Requests") {
                setShowAlert(true);
                queryClient.setQueryData(
                    ["tournament", searchParams.get("tournamentID")],
                    {
                        ...tournamentData,
                        quickJoinQueue: [
                            ...tournamentData.quickJoinQueue,
                            localStorage.getItem("summonerID"),
                        ],
                    }
                );
                setInQueue(true);
            }
        },
        onError: (error) => {
            setAlertMessage(error.response.data);
            setShowAlert(true);
        },
    });

    const handleQuickJoin = () => {
        if (!inQueue && !tournamentJoinStatus) {
            quickJoin();
        }
    };

    const createTeam = () => {
        if (
            !tournamentJoinStatus &&
            tournamentData.teams.length < tournamentData.teamsCap
        ) {
            navigate(
                `/createTeam?tournamentID=${searchParams.get("tournamentID")}`
            );
        }
    };

    const resetRoleQuery = () => {
        setRoleQueries(["Top", "Jungle", "Mid", "Bot", "Support"]);
    };

    const filteredTeamsList = data?.pages.flatMap((page) =>
        page.teams.filter((team) => {
            if (team.inviteCode == inviteCode) {
                return true;
            }
            if (inviteCode == "") {
                for (let i = 0; i < roleQueries.length; i++) {
                    if (team.rolesFilled[roleQueries[i]] === null) {
                        return true;
                    }
                }
            }
            return false;
        })
    );

    console.log(filteredTeamsList);

    if (tournamentDataError || tournamentJoinStatusError) {
        return (
            <ErrorText>
                Error loading teams data, please try refreshing!
            </ErrorText>
        );
    }

    return (
        <div className="teamsListWrapper">
            {quickJoinLoading && <LoadingScreen />}
            {showGoodAlert && (
                <CustomAlert
                    alertType="success"
                    setShowAlert={() => setShowGoodAlert(false)}
                >
                    You are on the queue and will be joined as soon as a team
                    opens up!
                </CustomAlert>
            )}
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
                <h1 className="tournamentFormSectionTitleBlue">Team Menu</h1>
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
                            className={`joinedTeamsSubmitButton ${
                                inQueue || tournamentJoinStatus
                                    ? "tournamentButtonDisabledHighlight"
                                    : "submitButtonUnlocked"
                            } quickJoinButton blueTextHalo`}
                            onClick={handleQuickJoin}
                            data-tooltip-id="quickJoinTooltip"
                            data-tooltip-content={`${
                                tournamentJoinStatus
                                    ? "Already Joined a Team!"
                                    : "Already in Queue!"
                            }`}
                        >
                            {inQueue && !tournamentJoinStatus ? (
                                <div className="lds-ellipsis">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            ) : (
                                "Quick Join"
                            )}
                        </button>
                        {(inQueue || tournamentJoinStatus) && (
                            <Tooltip
                                id="quickJoinTooltip"
                                className="tooltipAddOn"
                            />
                        )}
                        <button
                            className={`joinedTeamsSubmitButton ${
                                !tournamentJoinStatus &&
                                tournamentData?.teams.length <
                                    tournamentData?.teamsCap
                                    ? "submitButtonUnlocked"
                                    : "tournamentButtonDisabledHighlight"
                            } quickJoinButton blueTextHalo`}
                            onClick={createTeam}
                            data-tooltip-id="createTeamTooltip"
                            data-tooltip-content={`${
                                tournamentJoinStatus
                                    ? "Already Joined a Team!"
                                    : "Team Capcity Reached, try Joining One!"
                            }`}
                        >
                            Create Team
                        </button>
                        {(tournamentJoinStatus ||
                            tournamentData?.teams.length >=
                                tournamentData?.teamsCap) && (
                            <Tooltip
                                id="createTeamTooltip"
                                className="tooltipAddOn"
                            />
                        )}
                    </div>
                </div>
            </div>
            {isTournamentJoinStatusLoading ||
            isTournamentDataLoading ||
            isLoading ? (
                <LoadingAnimation />
            ) : (
                <div className="openTeamsWrapper">
                    {filteredTeamsList.map((team, i) => (
                        <TeamCardTemp
                            key={i}
                            {...team}
                            tournamentJoinStatus={tournamentJoinStatus}
                        />
                    ))}
                    {hasNextPage && (
                        <button
                            onClick={fetchNextPage}
                            className="teamsListGetNextButton"
                        >
                            {isFetchingNextPage ? (
                                <LoadingAnimation />
                            ) : (
                                "Load More Teams"
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default LoginGuard(TeamsList);
