import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { MdOutlineAddBox } from "react-icons/md";

import TeamCard from "./teamCard";

import services from "../../services";

function TeamListing(props) {
    const navigate = useNavigate();

    const [teamRequestStatus, setRequestJoinStatus] = useState(false);

    useEffect(() => {
        services
            .checkIfRequestedTeam({
                summonerID: localStorage.getItem("summonerID"),
                teamID: props.id,
            })
            .then((response) => {
                setRequestJoinStatus(response.data["status"]);
            });
    }, [props.id]);

    const joinTeamButton = (props) => {
        if (props.teamJoiningMode === "public") {
            return (
                <button
                    className="teamButton"
                    disabled={props.tournamentJoinStatus}
                    onClick={props.onClick}
                >
                    <div className="ButtonWrapper">
                        {props.tournamentJoinStatus
                            ? "Already Registered"
                            : "Join"}
                        {!props.tournamentJoinStatus && (
                            <MdOutlineAddBox className="ButtonIcon" />
                        )}
                    </div>
                </button>
            );
        } else if (props.teamJoiningMode === "request-only") {
            return (
                <button
                    className="teamButton"
                    disabled={props.tournamentJoinStatus || teamRequestStatus}
                    onClick={props.onClick}
                >
                    <div className="ButtonWrapper">
                        {props.tournamentJoinStatus
                            ? "Already Registered"
                            : "Send Request"}
                        {!props.tournamentJoinStatus && (
                            <MdOutlineAddBox className="ButtonIcon" />
                        )}
                    </div>
                </button>
            );
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
                    services.requestJoin({
                        summonerID: localStorage.getItem("summonerID"),
                        teamID: props.id,
                    });
                    setRequestJoinStatus(true);
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
