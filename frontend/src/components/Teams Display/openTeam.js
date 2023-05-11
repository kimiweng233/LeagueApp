import { useNavigate } from 'react-router-dom';

import TeamCard from './teamCard';

import services from '../../services'

function TeamListing(props) {

    const navigate = useNavigate();

    const joinTeamButton = (props) => {
        if (props.teamJoiningMode === "public") {
            return <button onClick={props.onCLick}>Join</button>
        } else if (props.teamJoiningMode === "request-only") {
            return <button onClick={props.onCLick}>Send Request</button>
        }
    }

    const joinTeamFunc = (props) => {
        if (props.teamJoiningMode === "public") {
            return {
                onClick: () => services.joinTeam({"summonerID": localStorage.getItem("summonerID"), "teamID": props.id}).then(
                    navigate(`/team?teamID=${props.id}`)
                )
            }
        } else if (props.teamJoiningMode === "request-only") {
            return {
                onClick: () => console.log("meow meow")
            }
        }
    }

    const WrappedComponent = TeamCard([{"button": joinTeamButton, "props": joinTeamFunc}]);

    return <WrappedComponent {...props} />;
}
  
export default TeamListing;