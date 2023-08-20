import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Tooltip } from "react-tooltip";
import CustomAlert from "../components/Utilities/customAlert";

import { AiOutlineCopy } from "react-icons/ai";
import { FaListUl, FaSort } from "react-icons/fa";

import services from "../services";

import LoginGuard from "../components/Utilities/loginGuard";
import MemberCard from "../components/Teams Display/memberCard";
import RequestMemberCard from "../components/Teams Display/requestMemberCard";
import { compareRank } from "../utilities/rankConversions";
import LoadingAnimation from "../components/Utilities/loadingAnimation";
import ErrorText from "../components/Utilities/errorText";

import "../assets/css/teamMenu.css";
import LoadingScreen from "../components/Utilities/loadingScreen";

function TeamMenu(props) {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const [showGoodAlert, setShowGoodAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const {
        data: teamData,
        isLoading: isTeamDataLoading,
        fetchStatus: teamDataFetchStatus,
        isError: teamDataError,
    } = useQuery({
        queryKey: ["team-data", searchParams.get("teamID")],
        queryFn: async () =>
            services.getTeamData({
                id: searchParams.get("teamID"),
            }),
        retry: false,
        refetchInterval: 15000,
    });

    console.log(teamData);

    const teamDataLoading = isTeamDataLoading && teamDataFetchStatus !== "idle";

    const [globalCollapseStatus, setGlobalCollapseStatus] = useState(false);
    const [numOfExpandedMemberPanels, setNumOfExpandedMemberPanels] =
        useState();
    const [membersSort, setMembersSort] = useState("time joined");
    const [teamMembers, setTeamMembers] = useState([]);

    const [globalRequestCollapseStatus, setGlobalRequestCollapseStatus] =
        useState(false);
    const [numOfExpandedRequestPanels, setNumOfExpandedRequestPanels] =
        useState();
    const [requestsSort, setRequestsSort] = useState("time requested");
    const [teamRequests, setTeamRequests] = useState([]);

    const [changeSignal, setChangeSignal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isTeamDataLoading) {
            setTeamMembers([...teamData["members"]]);
            setTeamRequests(teamData["requests"]);
            setNumOfExpandedMemberPanels(teamData["members"].length);
            setNumOfExpandedRequestPanels(teamData["requests"].length);
        }
    }, [teamData, isTeamDataLoading, teamDataFetchStatus]);

    useEffect(() => {}, [
        numOfExpandedMemberPanels,
        numOfExpandedRequestPanels,
    ]);

    const {
        mutate: changeTeamJoiningMode,
        isLoading: changeTeamJoiningModeLoading,
    } = useMutation({
        mutationFn: (joiningMode) =>
            services.changeTeamJoiningMode({
                teamID: searchParams.get("teamID"),
                newJoiningMode: joiningMode,
            }),
        onSuccess: (newJoiningMode) => {
            queryClient.setQueryData(["team-data", teamData.id.toString()], {
                ...teamData,
                teamJoiningMode: newJoiningMode,
            });
        },
        onError: (error) => {
            setAlertMessage(error.response.data);
            setShowAlert(true);
        },
    });

    const { mutate: removeFromTeam, isLoading: removeFromTeamLoading } =
        useMutation({
            mutationFn: () =>
                services.removeFromTeam({
                    summonerID: localStorage.getItem("summonerID"),
                    teamID: searchParams.get("teamID"),
                }),
            onSuccess: () => {
                navigate(`/teams?tournamentID=${teamData["tournament"]}`);
            },
            onError: (error) => {
                setAlertMessage(error.response.data);
                setShowAlert(true);
            },
        });

    const leaveTeam = () => {
        removeFromTeam();
    };

    const changeMembersSort = () => {
        let sortedMembers = [...teamMembers];
        if (membersSort == "time joined") {
            setMembersSort("rank");
            sortedMembers.sort((memberA, memberB) => {
                const memberARank = memberA.tier + memberA.rank;
                const memberBRank = memberB.tier + memberB.rank;
                return compareRank(memberARank, memberBRank);
            });
        } else if (membersSort == "rank") {
            setMembersSort("winrate");
            sortedMembers.sort((memberA, memberB) => {
                return memberB.winrate - memberA.winrate;
            });
        } else if (membersSort == "winrate") {
            setMembersSort("time joined");
            sortedMembers = teamData.members;
        }
        setGlobalCollapseStatus(false);
        setNumOfExpandedMemberPanels(teamData.requests.length);
        setChangeSignal(!changeSignal);
        setTeamMembers(sortedMembers);
    };

    const changeGlobalCollapseStatus = () => {
        if (numOfExpandedMemberPanels < teamData.members.length) {
            setGlobalCollapseStatus(false);
            setNumOfExpandedMemberPanels(teamData.members.length);
        } else {
            setGlobalCollapseStatus(true);
            setNumOfExpandedMemberPanels(0);
        }
        setChangeSignal(!changeSignal);
    };

    const changeRequestsSort = () => {
        let sortedRequests = [...teamRequests];
        if (requestsSort == "time requested") {
            setRequestsSort("rank");
            sortedRequests.sort((memberA, memberB) => {
                const memberARank = memberA.tier + memberA.rank;
                const memberBRank = memberB.tier + memberB.rank;
                return compareRank(memberARank, memberBRank);
            });
        } else if (requestsSort == "rank") {
            setRequestsSort("winrate");
            sortedRequests.sort((memberA, memberB) => {
                return memberB.winrate - memberA.winrate;
            });
        } else if (requestsSort == "winrate") {
            setRequestsSort("time requested");
            sortedRequests = teamData.requests;
        }
        setGlobalRequestCollapseStatus(false);
        setNumOfExpandedRequestPanels(teamData.requests.length);
        setChangeSignal(!changeSignal);
        setTeamRequests(sortedRequests);
    };

    const changeGlobalRequestCollapseStatus = () => {
        if (numOfExpandedRequestPanels < teamData.requests.length) {
            setGlobalRequestCollapseStatus(false);
            setNumOfExpandedRequestPanels(teamData.requests.length);
        } else {
            setGlobalRequestCollapseStatus(true);
            setNumOfExpandedRequestPanels(0);
        }
        setChangeSignal(!changeSignal);
    };

    if (teamDataError) {
        return (
            <ErrorText>
                Error loading teams data, please try refreshing!
            </ErrorText>
        );
    }

    return (
        <div className="teamMenuWrapper">
            {(changeTeamJoiningModeLoading || removeFromTeamLoading) && (
                <LoadingScreen />
            )}
            {showGoodAlert && (
                <CustomAlert
                    alertType="success"
                    setShowAlert={() => setShowGoodAlert(false)}
                >
                    Team Invite Link Copied!
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
            <div className="teamMenu">
                {!teamDataLoading ? (
                    <div className="teamMenuComponent">
                        <div className="teamMenuTopSection">
                            <div className="teamTitleSection">
                                <div className="coupledElements">
                                    <h1 className="teamTitleFont teamName">
                                        {teamData?.teamName}
                                    </h1>
                                    <h1 className="teamTitleFont">
                                        ({teamData?.teamAcronym})
                                    </h1>
                                </div>
                                <div className="coupledElements inviteCodeSection">
                                    <p className="inviteCodeLabel">
                                        Invite Code:
                                    </p>
                                    <p className="teamInviteCode">
                                        {teamData?.inviteCode}
                                    </p>
                                    <div className="copyButtonWrapper">
                                        <AiOutlineCopy
                                            className="teamMenuButton"
                                            onClick={() => {
                                                setShowGoodAlert(true);
                                                navigator.clipboard.writeText(
                                                    window.location.origin.toString() +
                                                        `/teamInvite?tournamentID=${teamData.tournament}&teamID=${teamData.id}`
                                                );
                                            }}
                                            data-tooltip-id="copyLinkTooltip"
                                            data-tooltip-content="Copy Invite Link"
                                        />
                                        <Tooltip
                                            id="copyLinkTooltip"
                                            className="tooltipAddOn"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                className="leaveTeamButton redButtonHalo"
                                onClick={leaveTeam}
                            >
                                LEAVE
                            </button>
                        </div>
                        <div className="teamJoiningModeButtonsSet">
                            <button
                                type="button"
                                onClick={() => changeTeamJoiningMode("public")}
                                className={`${
                                    teamData?.teamJoiningMode == "public"
                                        ? "teamCreationButtonClicked"
                                        : "teamCreationButtonUnclicked"
                                } teamJoiningModeButton teamCreationInputLeftButton teamCreationButtonLeft ${
                                    teamData?.teamJoiningMode == "public" &&
                                    "teamCreationLeftButtonRightHighlight"
                                }`}
                            >
                                Public
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    changeTeamJoiningMode("request-only")
                                }
                                className={`${
                                    teamData?.teamJoiningMode == "request-only"
                                        ? "teamCreationButtonClicked"
                                        : "teamCreationButtonUnclicked"
                                } teamJoiningModeButton teamCreationInputCenterButton ${
                                    teamData?.teamJoiningMode ==
                                        "request-only" &&
                                    "teamCreationCenterButtonRightHighlight"
                                } ${
                                    teamData?.teamJoiningMode == "public" &&
                                    "teamCreationCenterButtonLeftHighlight"
                                }`}
                            >
                                Request-Only
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    changeTeamJoiningMode("invite-only")
                                }
                                className={`${
                                    teamData?.teamJoiningMode == "invite-only"
                                        ? "teamCreationButtonClicked"
                                        : "teamCreationButtonUnclicked"
                                } teamJoiningModeButton teamCreationInputRightButton ${
                                    teamData?.teamJoiningMode ==
                                        "request-only" &&
                                    "teamCreationRightButtonLeftHighlight"
                                }`}
                            >
                                Invite-Only
                            </button>
                        </div>
                        <div className="teamMemberCardsWrapper">
                            <div className="teamMemberCardSectionWrapper">
                                <h3 className="teamMemberCardSectionTitle">
                                    Team Members
                                </h3>
                                <div className="teamMemberCardsButtons">
                                    <div
                                        className="sortMembersWrapper"
                                        onClick={changeGlobalCollapseStatus}
                                    >
                                        <FaListUl className="massCollapseButton" />
                                        <h5 className="sortMembersText blueTextHighlights">
                                            {numOfExpandedMemberPanels <
                                            teamData?.members.length
                                                ? "expand all"
                                                : "collapse all"}
                                        </h5>
                                    </div>
                                    <div
                                        className="sortMembersWrapper"
                                        onClick={changeMembersSort}
                                    >
                                        <FaSort className="sortMemebersButton" />
                                        <h5 className="sortMembersText blueTextHighlights">
                                            {membersSort}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="teamMemberCards formInfoBackground">
                                {teamMembers.map((member, i) => {
                                    return (
                                        <MemberCard
                                            key={i}
                                            {...member}
                                            globalCollapseStatus={
                                                globalCollapseStatus
                                            }
                                            numOfExpandedMemberPanels={
                                                numOfExpandedMemberPanels
                                            }
                                            setNumOfExpandedMemberPanels={
                                                setNumOfExpandedMemberPanels
                                            }
                                            teamData={teamData}
                                            changeSignal={changeSignal}
                                            roles={teamData?.rolesFilled}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        {teamData?.teamJoiningMode === "request-only" &&
                            teamRequests.length > 0 && (
                                <div className="teamMemberCardsWrapper">
                                    <div className="teamMemberCardSectionWrapper">
                                        <h3 className="teamMemberCardSectionTitle">
                                            Requests
                                        </h3>
                                        <div className="teamMemberCardsButtons">
                                            <div
                                                className="sortMembersWrapper"
                                                onClick={
                                                    changeGlobalRequestCollapseStatus
                                                }
                                            >
                                                <FaListUl className="massCollapseButton" />
                                                <h5 className="sortMembersText blueTextHighlights">
                                                    {numOfExpandedRequestPanels <
                                                    teamData?.requests.length
                                                        ? "expand all"
                                                        : "collapse all"}
                                                </h5>
                                            </div>
                                            <div
                                                className="sortMembersWrapper"
                                                onClick={changeRequestsSort}
                                            >
                                                <FaSort className="sortMemebersButton" />
                                                <h5 className="sortMembersText blueTextHighlights">
                                                    {requestsSort}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="teamMemberCards formInfoBackground">
                                        {teamRequests.map((member, i) => {
                                            return (
                                                <RequestMemberCard
                                                    key={i}
                                                    {...member}
                                                    globalCollapseStatus={
                                                        globalRequestCollapseStatus
                                                    }
                                                    numOfExpandedMemberPanels={
                                                        numOfExpandedRequestPanels
                                                    }
                                                    setNumOfExpandedMemberPanels={
                                                        setNumOfExpandedRequestPanels
                                                    }
                                                    changeSignal={changeSignal}
                                                    teamData={teamData}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                    </div>
                ) : (
                    <LoadingAnimation />
                )}
            </div>
        </div>
    );
}

export default LoginGuard(TeamMenu);
