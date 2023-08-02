import { Tooltip } from "react-tooltip";

import { BiSlideshow } from "react-icons/bi";

import TournamentCard from "./tournamentCard";

function OngoingTournament(props) {
    const ViewLivestream = (props) => {
        return (
            <div>
                <button
                    className={`tournamentCardButton joinedTeamsSubmitButton ${
                        props.liveLink != null
                            ? "tournamentButtonHighlight"
                            : "tournamentButtonDisabledHighlight"
                    } quickJoinButton`}
                    onClick={(event) => {
                        props.onClick(event);
                    }}
                    data-tooltip-id="watchLiveTooltip"
                    data-tooltip-content="Watch Live!"
                >
                    <BiSlideshow className="tournamentButtonIcon" />
                </button>
                {props.liveLink != null && (
                    <Tooltip id="watchLiveTooltip" className="tooltipAddOn" />
                )}
            </div>
        );
    };

    const viewLivestreamFunc = (props) => {
        return {
            liveLink: props.liveLink,
            onClick: (event) => {
                event.stopPropagation();
                if (props.liveLink != null) {
                    window.open(props.liveLink, "_blank");
                }
            },
        };
    };

    const WrappedComponent = TournamentCard([
        { button: ViewLivestream, props: viewLivestreamFunc },
    ]);

    return <WrappedComponent {...props} />;
}

export default OngoingTournament;
