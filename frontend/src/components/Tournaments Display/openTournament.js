import { useNavigate } from "react-router-dom";

import { MdOutlineAddBox } from "react-icons/md";
import { FaListUl } from "react-icons/fa";

import TournamentCard from "./tournamentCard";

function OpenTournament(props) {
    const navigate = useNavigate();

    const RegisterTeamButton = (props) => {
        return (
            <button
                className="tournamentButton"
                disabled={
                    props.alreadyJoined || props.teamsNum >= props.teamsCap
                }
                onClick={props.onClick}
            >
                <div className="tournamentButtonContentWrapper">
                    <h2>
                        {props.alreadyJoined
                            ? "Already Joined"
                            : props.teamsNum >= props.teamsCap
                            ? "Full Capacity"
                            : "Register Team"}
                    </h2>
                    {!props.alreadyJoined &&
                        props.teamsNum < props.teamsCap && (
                            <MdOutlineAddBox className="tournamentButtonRegisterIcon" />
                        )}
                </div>
            </button>
        );
    };

    const registerFunc = (props) => {
        return {
            onClick: () => navigate(`/createTeam?tournamentID=${props.id}`),
            alreadyJoined: props.alreadyJoined,
            teamsNum: props.teams.length,
            teamsCap: props.teamsCap,
        };
    };

    const ViewTeamsButton = (props) => {
        return (
            <button className="tournamentButton" onClick={props.onClick}>
                <div className="tournamentButtonContentWrapper">
                    <h2>
                        {props.alreadyJoined ? "Already Joined" : "View Teams"}
                    </h2>
                    {!props.alreadyJoined && (
                        <FaListUl className="tournamentButtonViewTeamsIcon" />
                    )}
                </div>
            </button>
        );
    };

    const viewTeamsFunc = (props) => {
        return {
            onClick: () => navigate(`/teams?tournamentID=${props.id}`),
        };
    };

    const WrappedComponent = TournamentCard([
        { button: RegisterTeamButton, props: registerFunc },
        { button: ViewTeamsButton, props: viewTeamsFunc },
    ]);

    return <WrappedComponent {...props} />;
}

export default OpenTournament;
