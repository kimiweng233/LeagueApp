import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import LoadingScreen from "../Utilities/loadingScreen";
import LoadingAnimation from "../Utilities/loadingAnimation";
import TeamCard from "./teamCard";

import services from "../../services";

const TeamListing = React.forwardRef((props, ref) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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

    const joinTeamButton = (props) => {
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
                            onClick={props.onClick}
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
                            onClick={props.onClick}
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

    const joinTeamFunc = (props) => {
        if (props.teamJoiningMode === "public") {
            return {
                onClick: joinPublicTeam,
                teamJoiningMode: props.teamJoiningMode,
                tournamentJoinStatus: props.tournamentJoinStatus,
            };
        } else if (props.teamJoiningMode === "request-only") {
            return {
                onClick: joinPrivateTeam,
                teamJoiningMode: props.teamJoiningMode,
                tournamentJoinStatus: props.tournamentJoinStatus,
            };
        }
    };

    const WrappedComponent = TeamCard([
        { button: joinTeamButton, props: joinTeamFunc },
        (ref = { ref }),
    ]);

    return <WrappedComponent {...props} />;
});

export default TeamListing;
