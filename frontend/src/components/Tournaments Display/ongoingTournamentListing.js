import { useNavigate } from "react-router-dom";

import { TbTournament } from "react-icons/tb";
import { BiSlideshow } from "react-icons/bi";

import TournamentCard from "./tournamentCard";

function OngoingTournament(props) {
    const navigate = useNavigate();

    const ViewBracketButton = (props) => {
        return (
            <button className="tournamentButton" onClick={props.onClick}>
                <div className="tournamentButtonContentWrapper">
                    <h2>View Bracket</h2>
                    <TbTournament className="tournamentButtonBracketIcon" />
                </div>
            </button>
        );
    };

    const viewBracketFunc = (props) => {
        return {
            onClick: () => navigate(`/tournamentPage?tournamentID=${props.id}`),
        };
    };

    const ViewLivestream = (props) => {
        return (
            <button className="tournamentButton" onClick={props.onClick}>
                <div className="tournamentButtonContentWrapper">
                    <h2>Watch Live</h2>
                    <BiSlideshow className="tournamentButtonTVIcon" />
                </div>
            </button>
        );
    };

    const viewLivestreamFunc = (props) => {
        return {
            onClick: () => {
                if (props.livestreamLink !== null) {
                    window.location = props.livestreamLink;
                }
            },
        };
    };

    const WrappedComponent = TournamentCard([
        { button: ViewBracketButton, props: viewBracketFunc },
        { button: ViewLivestream, props: viewLivestreamFunc },
    ]);

    return <WrappedComponent {...props} />;
}

export default OngoingTournament;
