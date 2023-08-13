import React from "react";

import { FaCrown } from "react-icons/fa";

import TournamentAdminBracketTeam from "./tournamentAdminBracketTeam";

function TournamentAdminBracketCard(props) {
    const game = props.game;
    const advanceRound = props.advanceRound;

    return (
        <div className="tournamentBracketCardOuterWrapper">
            <div
                className={`tournamentBracketCardOuterBorder  ${
                    game["Status"] == "Playing" && "ongoingGameHighlight"
                } ${game["Status"] == "Ended" && "idleGameHighlight"}`}
            >
                <div className={`tournamentAdminBracketCardWrapper`}>
                    <TournamentAdminBracketTeam
                        team={game["Team 1"]}
                        enable={game["Status"] == "Playing"}
                    />
                    <TournamentAdminBracketTeam
                        team={game["Team 2"]}
                        enable={game["Status"] == "Playing"}
                    />
                </div>
                {game["Status"] == "Playing" && (
                    <div
                        className="tournamentAdminBracketButton tournamentAdminBracketCrownButton"
                        // onClick={updateBracket}
                        onClick={() => {
                            advanceRound({
                                currGameNum_in: game["Game Number"],
                                nextGameNum_in: game["Next Game"],
                                teamName_in:
                                    game["Team 1"]["Score"] >
                                    game["Team 2"]["Score"]
                                        ? game["Team 1"]["Name"]
                                        : game["Team 2"]["Name"],
                                id_in:
                                    game["Team 1"]["Score"] >
                                    game["Team 2"]["Score"]
                                        ? game["Team 1"]["id"]
                                        : game["Team 2"]["id"],
                            });
                        }}
                    >
                        <FaCrown />
                    </div>
                )}
            </div>
        </div>
    );
}

export default TournamentAdminBracketCard;
