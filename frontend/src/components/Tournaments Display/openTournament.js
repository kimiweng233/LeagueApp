import { useNavigate } from "react-router-dom";

import { Tooltip } from "react-tooltip";

import { MdOutlineAddBox } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { FaListUl } from "react-icons/fa";

import TournamentCard from "./tournamentCard";

function OpenTournament(props) {
    const navigate = useNavigate();

    const RegisterTeamButton = (props) => {
        return (
            <div>
                <button
                    className={`tournamentCardButton joinedTeamsSubmitButton ${
                        !(
                            props.alreadyJoined ||
                            props.teamsNum >= props.teamsCap
                        )
                            ? "tournamentButtonHighlight"
                            : "tournamentButtonDisabledHighlight"
                    } quickJoinButton`}
                    onClick={(event) => {
                        props.onClick(event);
                    }}
                    data-tooltip-id="createteamTooltip"
                    data-tooltip-content={
                        props.alreadyJoined
                            ? "Already Joined the Tournament!"
                            : props.teamsNum >= props.teamsCap
                            ? "Team Capacity has been Reached!"
                            : "Create a Team!"
                    }
                >
                    <div className="tournamentButtonContentWrapper">
                        {!props.alreadyJoined &&
                        props.teamsNum < props.teamsCap ? (
                            <MdOutlineAddBox className="tournamentButtonIcon" />
                        ) : (
                            <ImCancelCircle className="tournamentButtonIconSmall" />
                        )}
                    </div>
                </button>
                <Tooltip id="createteamTooltip" className="tooltipAddOn" />
            </div>
        );
    };

    const registerFunc = (props) => {
        return {
            onClick: (event) => {
                event.stopPropagation();
                if (
                    !(props.alreadyJoined || props.teamsNum >= props.teamsCap)
                ) {
                    navigate(`/createTeam?tournamentID=${props.id}`);
                }
            },
            alreadyJoined: props.alreadyJoined,
            teamsNum: props.teams.length,
            teamsCap: props.teamsCap,
        };
    };

    const ViewTeamsButton = (props) => {
        return (
            <div>
                <button
                    className="tournamentCardButton joinedTeamsSubmitButton tournamentButtonHighlight quickJoinButton"
                    onClick={(event) => {
                        props.onClick(event);
                    }}
                    data-tooltip-id="viewTeamsTooltip"
                    data-tooltip-content="View Teams!"
                >
                    <div className="tournamentButtonContentWrapper">
                        {!props.alreadyJoined && (
                            <FaListUl className="tournamentButtonIconSmall" />
                        )}
                    </div>
                </button>
                <Tooltip id="viewTeamsTooltip" className="tooltipAddOn" />
            </div>
        );
    };

    const viewTeamsFunc = (props) => {
        return {
            onClick: (event) => {
                event.stopPropagation();
                navigate(`/teams?tournamentID=${props.id}`);
            },
        };
    };

    const WrappedComponent = TournamentCard([
        { button: RegisterTeamButton, props: registerFunc },
        { button: ViewTeamsButton, props: viewTeamsFunc },
    ]);

    return <WrappedComponent {...props} />;
}

export default OpenTournament;
