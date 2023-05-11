import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

import services from '../services'

import OpenTeam from '../components/Teams Display/openTeam'
import LoginGuard from '../components/loginGuard';

function TeamsList() {

  const [teamsList, setTeamsList] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    services.getTeamsList({"id": searchParams.get("tournamentID")}).then(response => {
        setTeamsList(response.data["teams"]);
    })
  }, [searchParams])

  return (
    <div>
      {teamsList && teamsList.map((team) => {
        return <OpenTeam key={team.id} {...team}/>
      })}
    </div>
  );
}
  
export default LoginGuard (TeamsList);