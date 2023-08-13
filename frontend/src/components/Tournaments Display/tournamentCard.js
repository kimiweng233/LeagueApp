import { useNavigate } from "react-router-dom";

import { calculateTimeRemaining } from "../../utilities/remainingTime";

const TournamentCard = (ButtonsList) => {
    const navigate = useNavigate();

    function WrappedComponent(props) {
        return (
            <div
                className="tournamentCard"
                onClick={() =>
                    navigate(`/tournamentPage?tournamentID=${props.id}`)
                }
            >
                <div className="tournamentTitle">
                    <h1>{props.tournamentName}</h1>
                    <p className="tournamentDate">
                        {calculateTimeRemaining(props.startTime)}
                    </p>
                </div>
                <div className="tournamentInfoWrapper">
                    <div className="tournamentInfoLeftColumn">
                        <div className="tournamentInfoLineWrapper">
                            <h3 className="bracketDescriptionTitle">
                                Format:{" "}
                            </h3>
                            <div className="bracketDescriptionInfoTextWrapper">
                                <h3 className="blueTextHalo bracketDescriptionInfoText">
                                    {props.tournamentFormat}
                                </h3>
                            </div>
                        </div>
                        <div className="tournamentInfoLineWrapper">
                            <h3 className="bracketDescriptionTitle">
                                Prize Pool:{" "}
                            </h3>
                            <div className="bracketDescriptionInfoTextWrapper">
                                <h3 className="blueTextHalo bracketDescriptionInfoText">
                                    {props.prizePool}$
                                </h3>
                            </div>
                        </div>
                        <div className="tournamentInfoLineWrapper">
                            <h3 className="bracketDescriptionTitle">Fee: </h3>
                            <div className="bracketDescriptionInfoTextWrapper">
                                <h3 className="blueTextHalo bracketDescriptionInfoText">
                                    {props.registrationFee}$
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="tournamentInfoDescriptiontWrapper">
                        {props.description ? (
                            <p className="bracketDescriptionTitle">
                                {props.description}
                            </p>
                        ) : (
                            <p className="bracketDescriptionTitle">
                                no description
                            </p>
                        )}
                    </div>
                    <div className="tournamentInfoRightColumn">
                        {" "}
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
