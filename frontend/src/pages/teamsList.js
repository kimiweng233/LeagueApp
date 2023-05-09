import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

import services from '../services'

import TeamListing from "../components/teamListing"
import LoginGuard from '../components/loginGuard';

function TeamsList() {

  const [teamsList, setTeamsList] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    services.getTeamsList({"id": searchParams.get("tournamentID")}).then(response => {
        setTeamsList(response.data["teams"]);
    })
  }, [])

  return (
    <div>
      {teamsList && teamsList.map((team) => {
        return <TeamListing key={team.id} {...team}/>
      })}
    </div>
  );
}
  
export default LoginGuard(TeamsList);