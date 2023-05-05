import { useNavigate } from 'react-router-dom';

function TournamentListing(prop) {

  const navigate = useNavigate();

  return (
    <div>
      <p>{prop.tournamentName}</p>
      <button onClick={() => { navigate(`/createTeam?tournamentID=${prop.id}`); }}>Register Team</button>
      <button onClick={() => { navigate(`/teams?tournamentID=${prop.id}`); }}>View Teams</button>
    </div>
  );
}
  
export default TournamentListing;