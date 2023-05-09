import { useNavigate } from 'react-router-dom';

import TournamentCard from './tournamentCard';

function OpenTournament(props) {

  const navigate = useNavigate();

  const RegisterTeamButton = (props) => {
    return <button onClick={props.onClick}>Register Team</button>;
  };
  
  const registerFunc= (props) => {
    return { 
      onClick: () => navigate(`/createTeam?tournamentID=${props.id}`) 
    }
  }
  
  const ViewTeamsButton = (props) => {
    return <button onClick={props.onClick}>View Teams</button>;
  };
  
  const viewTeamsFunc = (props) => {
    return { 
      onClick: () => navigate(`/teams?tournamentID=${props.id}`)
    }
  }

  const WrappedComponent =  TournamentCard(RegisterTeamButton, ViewTeamsButton, registerFunc, viewTeamsFunc);

  return <WrappedComponent {...props} />;

}
  
export default OpenTournament