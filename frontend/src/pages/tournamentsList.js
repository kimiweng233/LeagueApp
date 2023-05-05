import React, { useState, useEffect } from 'react';

import services from '../services'

import TournamentListing from '../components/tournamentListing';

function TournamentsList() {

  const [tournamentsList, setTournamentsList] = useState([]);

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
        return <TournamentListing key={tournament.id} {...tournament}/>
      })}
      <h1>Open Tournaments</h1>
      {tournamentsList && tournamentsList.filter( tournament => {
        return !tournament.started;
      }).map((tournament) => {
        return <TournamentListing key={tournament.id} {...tournament}/>
      })}
    </div>
  );
}
  
export default TournamentsList;