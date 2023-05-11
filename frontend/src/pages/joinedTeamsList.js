import React, { useState, useEffect } from 'react';

import services from '../services'

import UserTeam from '../components/Teams Display/userTeam'
import LoginGuard from '../components/loginGuard';

function JoinedTeams() {

  const [teamsList, setTeamsList] = useState([]);

  useEffect(() => {
    services.getTeamsJoined({"summonerID": localStorage.getItem("summonerID")}).then(response => {
        setTeamsList(response.data);
    })
  }, [])

  return (
    <div>
      {teamsList && teamsList.map((team) => {
        return (
          <UserTeam key={team.id} {...team} />
        )
      })}
    </div>
  );
}
  
export default LoginGuard(JoinedTeams);