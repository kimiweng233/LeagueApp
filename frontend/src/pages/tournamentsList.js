import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import services from '../services'

import OpenTournament from '../components/openTournament';
import OngoingTournament from '../components/ongoingTournamentListing';
import LoginGuard from '../components/loginGuard';

function TournamentsList() {

  const [tournamentsList, setTournamentsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    services.getTournamentsList().then(response => {
      setTournamentsList(response.data);
    })
  }, [])

  return (
    <div>
      <h1>Ongoing Tournaments</h1>
      {tournamentsList && tournamentsList.filter( tournament => {
        return tournament.started;
      }).map((tournament) => {
        return <OngoingTournament key={tournament.id} {...tournament}/>
        // return <TestTournamentListing key={tournament.id} {...tournament}/> 
      })}
      <h1>Open Tournaments</h1>
      {tournamentsList && tournamentsList.filter( tournament => {
        return !tournament.started;
      }).map((tournament) => {
        // return <TestTournamentListing key={tournament.id} {...tournament}/> 
        return <OpenTournament key={tournament.id} {...tournament}/>
      })}
    </div>
  );
}
  
export default LoginGuard(TournamentsList);