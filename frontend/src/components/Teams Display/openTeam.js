import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import LoadingAnimation from "../Utilities/loadingAnimation";
import TeamCard from "./teamCard";

import services from "../../services";

function TeamListing(props) {
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

    const joinTeamButton = (props) => {
        if (teamRequestStatusError) {
            return <h3>Error with team joining</h3>;
        }
        if (props.teamJoiningMode === "public") {
            if (teamRequestStatusLoading) {
                return <LoadingAnimation />;
            } else
                return (
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
                );
        } else if (props.teamJoiningMode === "request-only") {
            if (teamRequestStatusLoading) {
                return <LoadingAnimation />;
            } else {
                return (
                    <div className="teamButtonOuterShadow">
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
                onClick: () =>
                    services
                        .joinTeam({
                            summonerID: localStorage.getItem("summonerID"),
                            teamID: props.id,
                        })
                        .then((response) => {
                            navigate(`/team?teamID=${props.id}`);
                        }),
                teamJoiningMode: props.teamJoiningMode,
                tournamentJoinStatus: props.tournamentJoinStatus,
            };
        } else if (props.teamJoiningMode === "request-only") {
            return {
                onClick: () => {
                    services
                        .requestJoin({
                            summonerID: localStorage.getItem("summonerID"),
                            teamID: props.id,
                        })
                        .then((response) => {
                            queryClient.setQueryData(
                                [
                                    "team-request-status",
                                    props.id,
                                    localStorage.getItem("summonerID"),
                                ],
                                true
                            );
                        });
                },
                teamJoiningMode: props.teamJoiningMode,
                tournamentJoinStatus: props.tournamentJoinStatus,
            };
        }
    };

    const WrappedComponent = TeamCard([
        { button: joinTeamButton, props: joinTeamFunc },
    ]);

    return <WrappedComponent {...props} />;
}

export default TeamListing;
