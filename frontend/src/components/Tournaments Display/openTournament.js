import { useNavigate } from 'react-router-dom';

import TournamentCard from './tournamentCard';

function OpenTournament(props) {

  const navigate = useNavigate();

  const RegisterTeamButton = (props) => {
    return <button disabled={props.alreadyJoined} onClick={props.onClick}>{props.alreadyJoined ? "Already Joined" : "Register Team"}</button>;
  };
  
  const registerFunc= (props) => {
    return { 
      onClick: () => navigate(`/createTeam?tournamentID=${props.id}`),
      alreadyJoined: props.alreadyJoined,
    }
  }
  
  const ViewTeamsButton = (props) => {
    return <button disabled={props.alreadyJoined} onClick={props.onClick}>{props.alreadyJoined ? "Already Joined" : "View Teams"}</button>;
  };
  
  const viewTeamsFunc = (props) => {
    return { 
      onClick: () => navigate(`/teams?tournamentID=${props.id}`),
      alreadyJoined: props.alreadyJoined,
    }
  }

  const WrappedComponent =  TournamentCard([{"button": RegisterTeamButton, "props": registerFunc}, {"button": ViewTeamsButton, "props": viewTeamsFunc}]);

  return <WrappedComponent {...props} />;

}

export default OpenTournament