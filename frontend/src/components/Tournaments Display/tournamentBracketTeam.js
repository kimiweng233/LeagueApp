import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../../assets/css/tournamentBracket.css";

function TournamentBracketTeam(props) {
    const team = props.team;

    const navigate = useNavigate();

    return (
        <div className="tournamentBracketTeamWrapper">
            <div
                className={`tournamentBracketTeamCard 
                ${
                    team &&
                    team["Status"] != "Playing" &&
                    (team["Status"] == "Win"
                        ? "tournamentBracketTeamWinHighlight"
                        : "tournamentBracketTeamLossHighlight")
                }`}
                onClick={() => {
                    if (team) {
                        navigate(`/team?teamID=${team["id"]}`);
                    }
                }}
            >
                <p className="tournamentBracketText tournamentBracketTeamText">
                    {team ? team["Name"] : "TBD"}
                </p>
            </div>
            <div
                className={`tournamentBracketScoreCard ${
                    team &&
                    team["Status"] != "Playing" &&
                    (team["Status"] == "Win"
                        ? "tournamentBracketScoreWinHighlight"
                        : "tournamentBracketScoreLossHighlight")
                }`}
            >
                <p className="tournamentBracketText">
                    {team ? team["Score"] : 0}
                </p>
            </div>
        </div>
    );
}

export default TournamentBracketTeam;
