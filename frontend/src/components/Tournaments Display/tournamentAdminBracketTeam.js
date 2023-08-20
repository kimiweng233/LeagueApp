import "../../assets/css/tournamentBracket.css";

function TournamentAdminBracketTeam(props) {
    const team = props.team;
    const enable = props.enable;
    const updateScore = props.updateScore;

    return (
        <div className="tournamentBracketTeamWrapper">
            <div
                className={`tournamentAdminBracketTeamCard 
                ${
                    team &&
                    team["Status"] != "Playing" &&
                    (team["Status"] == "Win"
                        ? "tournamentBracketTeamWinHighlight"
                        : "tournamentBracketTeamLossHighlight")
                }`}
            >
                <p className="tournamentBracketText tournamentBracketTeamText">
                    {team ? team["Name"] : "TBD"}
                </p>
            </div>
            <div
                className={`tournamentAdminBracketScoreCard ${
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

            {enable && (
                <div
                    className="tournamentAdminBracketButton tournamentAdminBracketPlusButton"
                    onClick={() =>
                        updateScore({
                            id: team["id"],
                            score: team["Score"] + 1,
                        })
                    }
                >
                    <p className="tournamentAdminBracketTeamText">+</p>
                </div>
            )}
            {enable && (
                <div
                    className="tournamentAdminBracketButton tournamentAdminBracketMinusButton"
                    onClick={() =>
                        updateScore({
                            id: team["id"],
                            score: team["Score"] - 1,
                        })
                    }
                >
                    <p className="tournamentAdminBracketTeamText tournamentAdminBracketTeamMinusText">
                        -
                    </p>
                </div>
            )}
        </div>
    );
}

export default TournamentAdminBracketTeam;
