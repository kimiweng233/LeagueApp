import React, { useState, useEffect } from "react";

import { BiExpandVertical } from "react-icons/bi";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import LoadingScreen from "../Utilities/loadingScreen";
import LoadingAnimation from "../Utilities/loadingAnimation";
import TeamMembersTable from "./teamMembersTable";

import TopImage from "../../assets/Positions/Position_Challenger-Top.png";
import JungleImage from "../../assets/Positions/Position_Challenger-Jungle.png";
import MidImage from "../../assets/Positions/Position_Challenger-Mid.png";
import BotImage from "../../assets/Positions/Position_Challenger-Bot.png";
import SuppImage from "../../assets/Positions/Position_Challenger-Support.png";

import { getAverageRank } from "../../utilities/rankConversions";

import services from "../../services";

const TeamCardTemp = (props) => {
    const [avgTier, setAvgTier] = useState("");
    const [avgRank, setAvgRank] = useState("");
    const [showMembers, setShowMembers] = useState(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        let avg = getAverageRank(
            props.members
                .filter((member) => member["tier"] != null)
                .map((member) => {
                    return member["tier"].concat(member["rank"]);
                })
        );
        setAvgTier(avg["tier"]);
        setAvgRank(avg["rank"]);
    }, []);

    const {
        data: teamRequestStatus,
        isLoading: isTeamRequestStatusLoading,
        fetchStatus: teamRequestStatusFetchStatus,
        isError: teamRequestStatusError,
    } = useQuery({
        queryKey: [
            "team-request-status",
            props.id,
            localStorage.getItem("summonerID"),
        ],
        queryFn: async () =>
            services.checkIfRequestedTeam({
                summonerID: localStorage.getItem("summonerID"),
                teamID: props.id,
            }),
        retry: false,
    });

    const teamRequestStatusLoading =
        isTeamRequestStatusLoading && teamRequestStatusFetchStatus !== "idle";

    const { mutate: joinPublicTeam, isLoading: joinPublicTeamLoading } =
        useMutation({
            mutationFn: () =>
                services.joinTeam({
                    summonerID: localStorage.getItem("summonerID"),
                    teamID: props.id,
                }),
            onSuccess: () => {
                navigate(`/team?teamID=${props.id}`);
            },
        });

    const { mutate: joinPrivateTeam, isLoading: joinPrivateTeamLoading } =
        useMutation({
            mutationFn: () =>
                services.requestJoin({
                    summonerID: localStorage.getItem("summonerID"),
                    teamID: props.id,
                }),
            onSuccess: () => {
                queryClient.setQueryData(
                    [
                        "team-request-status",
                        props.id,
                        localStorage.getItem("summonerID"),
                    ],
                    true
                );
            },
        });

    const joinTeamButton = () => {
        if (teamRequestStatusError) {
            return <h3>Error with team joining</h3>;
        }
        if (props.teamJoiningMode === "public") {
            if (teamRequestStatusLoading) {
                return <LoadingAnimation />;
            } else
                return (
                    <div>
                        {(joinPublicTeamLoading || joinPrivateTeamLoading) && (
                            <LoadingScreen />
                        )}
                        <button
                            className={`teamButton blueTextHalo ${
                                props.tournamentJoinStatus
                                    ? "tournamentButtonDisabledHighlight"
                                    : "tournamentButtonHighlight"
                            }`}
                            disabled={props.tournamentJoinStatus}
                            onClick={joinPublicTeam}
                        >
                            <div className="ButtonWrapper">
                                {props.tournamentJoinStatus
                                    ? "Already Registered"
                                    : "Join"}
                            </div>
                        </button>
                    </div>
                );
        } else if (props.teamJoiningMode === "request-only") {
            if (teamRequestStatusLoading) {
                return <LoadingAnimation />;
            } else {
                return (
                    <div className="teamButtonOuterShadow">
                        {(joinPublicTeamLoading || joinPrivateTeamLoading) && (
                            <LoadingScreen />
                        )}
                        <button
                            className={`teamButton blueTextHalo ${
                                props.tournamentJoinStatus || teamRequestStatus
                                    ? "tournamentButtonDisabledHighlight"
                                    : "teamButtonHighlight"
                            }`}
                            disabled={
                                props.tournamentJoinStatus || teamRequestStatus
                            }
                            onClick={joinPrivateTeam}
                        >
                            <div className="ButtonWrapper">
                                {props.tournamentJoinStatus
                                    ? "Already Registered"
                                    : teamRequestStatus
                                    ? "Request Sent"
                                    : "Send Request"}
                            </div>
                        </button>
                    </div>
                );
            }
        }
    };

    return (
        <div className="teamCardWrapper">
            <div className="teamStatsWrapper">
                <div className="teamStats">
                    <div className="cardTitleWrapper">
                        <h1 className="cardTitle">
                            {props.teamName} ({props.teamAcronym})
                        </h1>
                    </div>
                    <div className="teamDetailsWrapper">
                        <div className="teamInfoWrapper">
                            <h4 className="cardTitle">
                                {props.members.length} / 5 Joined
                            </h4>
                            <div className="roleIconsWrapper">
                                <h4 className="cardTitle">Vacant Roles:</h4>
                                <div className="roleIcons">
                                    {props.rolesFilled["Top"] == null && (
                                        <img
                                            className="positionIcon"
                                            src={TopImage}
                                        />
                                    )}
                                    {props.rolesFilled["Jungle"] == null && (
                                        <img
                                            className="positionIcon"
                                            src={JungleImage}
                                        />
                                    )}
                                    {props.rolesFilled["Mid"] == null && (
                                        <img
                                            className="positionIcon"
                                            src={MidImage}
                                        />
                                    )}
                                    {props.rolesFilled["Bot"] == null && (
                                        <img
                                            className="positionIcon"
                                            src={BotImage}
                                        />
                                    )}
                                    {props.rolesFilled["Support"] == null && (
                                        <img
                                            className="positionIcon"
                                            src={SuppImage}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="teamAvgRankWrapper">
                                <h4 className="cardTitle">Average Rank:</h4>
                                <h4 className="avgRankText">
                                    {avgTier == "MASTER" ||
                                    avgTier == "GRANDMASTER" ||
                                    avgTier == "CHALLENGER"
                                        ? `${avgTier}`
                                        : `${avgTier} ${avgRank}`}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="teamButtons">{joinTeamButton()}</div>
            </div>
            <div
                className="memberBoardWrapper"
                onClick={() => {
                    setShowMembers(!showMembers);
                }}
            >
                <h4 className="blackText">Team Members</h4>
                <BiExpandVertical className="expandArrowIcon" />
            </div>
            {showMembers && <TeamMembersTable {...props} />}
        </div>
    );
};

export default TeamCardTemp;
