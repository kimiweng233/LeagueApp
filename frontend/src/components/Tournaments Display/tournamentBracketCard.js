import React from "react";

import TournamentBracketTeam from "./tournamentBracketTeam";

function TournamentBracketCard(props) {
    const game = props.game;
    const summonerTeam = props.summonerTeam;

    return (
        <div className="tournamentBracketCardOuterWrapper">
            <div
                className={`tournamentBracketCardOuterBorder  ${
                    game["Status"] == "Playing" &&
                    (game["Team 1"]["Name"] == summonerTeam ||
                    game["Team 2"]["Name"] == summonerTeam
                        ? "summonerTeamGameHighlight"
                        : "ongoingGameHighlight")
                } ${game["Status"] == "Ended" && "idleGameHighlight"}`}
            >
                <div className={`tournamentBracketCardWrapper`}>
                    <TournamentBracketTeam
                        team={game["Team 1"]}
                        summonerTeam={summonerTeam}
                    />
                    <TournamentBracketTeam
                        team={game["Team 2"]}
                        summonerTeam={summonerTeam}
                    />
                </div>
            </div>
        </div>
    );
}

export default TournamentBracketCard;
