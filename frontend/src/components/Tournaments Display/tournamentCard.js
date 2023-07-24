import { calculateTimeRemaining } from "../../utilities/remainingTime";

const TournamentCard = (ButtonsList) => {
    function WrappedComponent(props) {
        return (
            <div className="tournamentCardWrapper">
                <div
                    className={
                        props.tournamentStatus === "open"
                            ? "tournamentCard"
                            : "tournamentCardRed"
                    }
                >
                    <div className="tournamentInfoWrapper">
                        <div
                            className={
                                props.tournamentStatus === "open"
                                    ? "tournamentTitle"
                                    : "tournamentTitleRed"
                            }
                        >
                            <h1>{props.tournamentName}</h1>
                            <p className="tournamentDate">
                                {calculateTimeRemaining(props.startTime)}
                            </p>
                        </div>
                        <div
                            className={
                                props.tournamentStatus === "open"
                                    ? "tournamentInfo"
                                    : "tournamentInfoRed"
                            }
                        >
                            <div className="tournamentDetails">
                                <p>Tournament Format:</p>
                                <h4
                                    className={
                                        props.tournamentStatus === "open"
                                            ? "highlightedText"
                                            : "highlightedTextRed"
                                    }
                                >
                                    {props.tournamentFormat}
                                </h4>
                                <p>Prize Pool:</p>
                                <h4
                                    className={
                                        props.tournamentStatus === "open"
                                            ? "highlightedText"
                                            : "highlightedTextRed"
                                    }
                                >
                                    {props.prizePool}$
                                </h4>
                                <p>Registration Fee:</p>
                                <h4
                                    className={
                                        props.tournamentStatus === "open"
                                            ? "highlightedText"
                                            : "highlightedTextRed"
                                    }
                                >
                                    {props.registrationFee}$
                                </h4>
                            </div>
                            <div className="tournamentDescriptions">
                                <p>Description:</p>
                                <div
                                    className={
                                        props.tournamentStatus === "open"
                                            ? "tournamentDescription"
                                            : "tournamentDescriptionRed"
                                    }
                                >
                                    <p>{props.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tournamentButtons">
                        {ButtonsList.map((button, i) => {
                            return (
                                <button.button
                                    key={i}
                                    {...button.props(props)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
    return WrappedComponent;
};

export default TournamentCard;
