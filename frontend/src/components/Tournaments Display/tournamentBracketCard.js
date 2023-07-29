import React, { useState, useEffect } from "react";

import TournamentBracketTeam from "./tournamentBracketTeam";

import "../../assets/css/tournamentBracket.css";

function TournamentBracketCard(props) {
    const game = props.game;

    return (
        <div className="tournamentBracketCardOuterWrapper">
            <div
                className={`tournamentBracketCardOuterBorder ${
                    game["Status"] == "Playing" && "ongoingGameHighlight"
                } ${game["Ended"] == "Playing" && "idleGameHighlight"}`}
            >
                <div className={`tournamentBracketCardWrapper`}>
                    <TournamentBracketTeam team={game["Team 1"]} />
                    <TournamentBracketTeam team={game["Team 2"]} />
                </div>
            </div>
        </div>
    );
}

export default TournamentBracketCard;
