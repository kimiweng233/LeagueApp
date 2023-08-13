import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import services from "../../services";

import "../../assets/css/tournamentBracket.css";

function TournamentAdminBracketTeam(props) {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const team = props.team;
    const enable = props.enable;

    const { mutate: updateScore } = useMutation({
        mutationFn: (score) =>
            services.updateBracketScore({
                tournamentID: searchParams.get("tournamentID"),
                id: team["id"],
                newScore: score,
            }),
        onSuccess: (newScore) => {
            queryClient.setQueryData(
                ["tournament", searchParams.get("tournamentID")],
                {
                    ...queryClient.getQueryData([
                        "tournament",
                        searchParams.get("tournamentID"),
                    ]),
                    bracket: newScore,
                }
            );
        },
    });

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
                    onClick={() => updateScore(team["Score"] + 1)}
                >
                    <p className="tournamentAdminBracketTeamText">+</p>
                </div>
            )}
            {enable && (
                <div
                    className="tournamentAdminBracketButton tournamentAdminBracketMinusButton"
                    onClick={() => updateScore(team["Score"] - 1)}
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
