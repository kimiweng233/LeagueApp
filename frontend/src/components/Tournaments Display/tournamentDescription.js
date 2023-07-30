import { AiOutlineCopy } from "react-icons/ai";
import { BsFillPlayFill } from "react-icons/bs";

function TournamentDescription(props) {
    const tournamentData = props.tournamentData;
    const summonerTeam = props.summonerTeam;

    const getCurrentStatus = () => {
        if (!summonerTeam) {
            return "Not Joined";
        }
        for (let i = tournamentData.bracket.length - 1; i >= 0; i--) {
            for (let j = 0; j < tournamentData.bracket[i].length; j++) {
                const currentGame = tournamentData.bracket[i][j];
                if (
                    currentGame["Status"] == "Playing" &&
                    (currentGame["Team 1"]["Name"] == summonerTeam ||
                        currentGame["Team 2"]["Name"] == summonerTeam)
                ) {
                    return `${currentGame["Room Code"]}`;
                }
            }
        }
        return "Eliminated";
    };

    const currentStatus = getCurrentStatus();

    return (
        <div className="bracketDescriptionWrapper">
            <div className="bracketDescription">
                <div className="bracketDescriptionRow">
                    <div className="bracketDescriptionInfo">
                        <h2 className="bracketDescriptionTitle">Format: </h2>
                        <div className="bracketDescriptionInfoTextWrapper">
                            <h2 className="blueTextHalo bracketDescriptionInfoText">
                                {tournamentData.tournamentFormat}
                            </h2>
                        </div>
                    </div>
                    <div className="bracketDescriptionInfo">
                        <h2 className="bracketDescriptionTitle">Status: </h2>
                        {currentStatus == "Not Joined" ? (
                            <h2>Not Joined</h2>
                        ) : currentStatus == "Eliminated" ? (
                            <h2>Eliminated</h2>
                        ) : (
                            <div className="coupledElements inviteCodeSection">
                                <h2 className="bracketDescriptionTitle">
                                    current series at
                                </h2>
                                <h3 className="bracketCurrentGameText bracketDescriptionTitle">
                                    {currentStatus}
                                </h3>
                                <AiOutlineCopy
                                    className="teamMenuButton bracketCopyTextButton"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            currentStatus
                                        );
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="bracketDescriptionRow">
                    <div className="bracketDescriptionInfo">
                        <h2 className="bracketDescriptionTitle">
                            Prize Pool:{" "}
                        </h2>
                        <div className="bracketDescriptionInfoTextWrapper">
                            <h2 className="blueTextHalo bracketDescriptionInfoText">
                                {tournamentData.prizePool}$
                            </h2>
                        </div>
                    </div>
                    <div
                        className="coupledElements bracketDescriptionInfo cursorPointer"
                        onClick={() => {
                            if (tournamentData["liveLink"]) {
                                window.open(
                                    tournamentData["liveLink"],
                                    "_blank"
                                );
                            }
                        }}
                    >
                        <h2
                            className={`${
                                tournamentData["liveLink"]
                                    ? "blueTextHalo"
                                    : "greyTextHalo"
                            } bracketDescriptionInfoText`}
                        >
                            Watch Live
                        </h2>
                        <div
                            className={`${
                                tournamentData["liveLink"]
                                    ? "bracketWatchLiveButtonBlueHalo"
                                    : "bracketWatchLiveButtonGreyHalo"
                            } bracketWatchLiveButton`}
                        >
                            <BsFillPlayFill className="bracketWatchLiveButtonArrow" />
                        </div>
                    </div>
                </div>
                <h2 className="bracketDescriptionTitle bracketTournamentDescriptionTitle">
                    Description:{" "}
                </h2>
                <div className="bracketTournamentDescriptiontWrapper">
                    <p className="bracketDescriptionTitle">
                        {tournamentData.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TournamentDescription;