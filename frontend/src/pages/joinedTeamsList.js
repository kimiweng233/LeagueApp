import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import services from "../services";

import LoginGuard from "../components/Utilities/loginGuard";
import LoadingAnimation from "../components/Utilities/loadingAnimation";

import CountdownClock from "../components/Utilities/countDownClock";

import "../assets/css/joinedTeams.css";

function JoinedTeams() {
    const navigate = useNavigate();

    const {
        data: joinedTeams,
        isLoading: isJoinedTeamsLoading,
        fetchStatus: joinedTeamsFetchStatus,
    } = useQuery({
        queryKey: ["joined-teams", localStorage.getItem("summonerID")],
        queryFn: async () =>
            services.getTeamsJoined({
                summonerID: localStorage.getItem("summonerID"),
            }),
        retry: false,
    });

    const joinedTeamsLoading =
        isJoinedTeamsLoading && joinedTeamsFetchStatus !== "idle";

    return (
        <div>
            {joinedTeamsLoading ? (
                <LoadingAnimation />
            ) : (
                <div className="joinedTeamsListWrapper">
                    <div className="tournamentFormTitleSectionWrapper">
                        <div className="tournamentFormSectionTitleDividerBarsBlueLeft" />
                        <h1 className="tournamentFormSectionTitleBlue">
                            Joined Teams
                        </h1>
                        <div className="tournamentFormSectionTitleDividerBarsBlueRight" />
                    </div>
                    {joinedTeams.length == 0 ? (
                        <h1 className="NoMatchesSign">
                            No teams joined, go join one!
                        </h1>
                    ) : (
                        <div className="JoinedTeamsListWrapper">
                            {joinedTeams &&
                                joinedTeams.map((team, i) => {
                                    return (
                                        <div
                                            className="joinedTeamContentWrapper"
                                            key={i}
                                            onClick={() =>
                                                navigate(
                                                    `/team?teamID=${team["teamData"].id}`
                                                )
                                            }
                                        >
                                            <div className="joinedTeamNameWrapper">
                                                <h1 className="blueTextHalo">
                                                    {team["teamData"].teamName}
                                                </h1>
                                                <h1 className="blueTextHalo">
                                                    (
                                                    {
                                                        team["teamData"]
                                                            .teamAcronym
                                                    }
                                                    )
                                                </h1>
                                            </div>
                                            <div className="joinedTeamNameWrapper">
                                                <CountdownClock
                                                    className="joinTeamCountDown"
                                                    targetDateTime={
                                                        team["tournamentTime"]
                                                    }
                                                />
                                                <h3 className="blueTextHalo">
                                                    remaining
                                                </h3>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default LoginGuard(JoinedTeams);
