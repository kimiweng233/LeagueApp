import "../../assets/css/tournamentBracket.css";

function TournamentBracketMatchSign(props) {
    const game = props.game;
    const quarter = props.quarter;
    const semi = props.semi;
    const final = props.final;

    return (
        <div className="bracketMatchSignWrapper">
            <p className="bracketMatchSign">
                Match {game["Game Number"]} &middot; {game["Room Code"]} &nbsp;
            </p>
            {quarter && <p className="bracketMatchSign">(quarter) &nbsp;</p>}
            {semi && <p className="bracketMatchSign">(semi) &nbsp;</p>}
            {final && <p className="bracketMatchSign">(final) &nbsp;</p>}
            {game["Status"] == "Playing" && (
                <div className="inlineRipple">
                    <div></div>
                    <div></div>
                </div>
            )}
        </div>
    );
}

export default TournamentBracketMatchSign;
