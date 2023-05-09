import { useNavigate } from 'react-router-dom';

import TournamentCard from './tournamentCard';

function OngoingTournament(props) {

  const navigate = useNavigate();

  const ViewBracketButton = (props) => {
    return <button onClick={props.onClick}>View Bracket</button>;
  };
  
  const viewBracketFunc= (props) => {
    return { 
      onClick: () => navigate(`/tournamentPage?tournamentID=${props.id}`)
    }
  }
  
  const ViewLivestream = (props) => {
    return <button onClick={props.onClick}>Watch Live</button>;
  };
  
  const viewLivestreamFunc = (props) => {
    return { 
      onClick: () => {
        if (props.livestreamLink !== null) {
          window.location = props.livestreamLink;
        }
      }
    };
  }

  const WrappedComponent =  TournamentCard(ViewBracketButton, ViewLivestream, viewBracketFunc, viewLivestreamFunc);

  return <WrappedComponent {...props} />;

}
  
export default OngoingTournament