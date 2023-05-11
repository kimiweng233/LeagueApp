import React, { useState, useEffect } from 'react';

import services from '../services'

import OpenTournament from '../components/Tournaments Display/openTournament';
import OngoingTournament from '../components/Tournaments Display/ongoingTournamentListing';
import LoginGuard from '../components/loginGuard';

function TournamentsList() {

  const [tournamentsList, setTournamentsList] = useState([]);
  const [enrolledTournaments, setJoinedTournaments] = useState([]);

  useEffect(() => {
    services.getTournamentsList().then(response => {
      setTournamentsList(response.data);
    })
    services.getTournamentsJoined({"summonerID": localStorage.getItem("summonerID")}).then(response => {
      setJoinedTournaments(response.data.map(tournament => tournament.id));
    })
  }, [])

  return (
    <div>
      <h1>Ongoing Tournaments</h1>
      {tournamentsList && tournamentsList.filter( tournament => {
        return tournament.started;
      }).map((tournament) => {
        return <OngoingTournament key={tournament.id} {...tournament}/> 
      })}
      <h1>Open Tournaments</h1>
      {tournamentsList && tournamentsList.filter( tournament => {
        return !tournament.started;
      }).map((tournament) => {
        return <OpenTournament key={tournament.id} {...tournament} alreadyJoined={enrolledTournaments.includes(tournament.id)}/>
      })}
    </div>
  );
}
  
export default LoginGuard(TournamentsList);