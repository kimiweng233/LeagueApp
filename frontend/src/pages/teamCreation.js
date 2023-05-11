import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import services from '../services'
import LoginGuard from '../components/loginGuard';

function TeamForm() {
  const [teamName, setTeamName] = useState("");
  const [teamAcronym, setTeamAcronym] = useState("");
  const [teamJoiningMode, setTeamJoiningMode] = useState("public");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    services.createTeam({
      "teamData": {
        "teamName": teamName,
        "teamAcronym": teamAcronym,
        "tournament": searchParams.get("tournamentID"),
        "teamJoiningMode": teamJoiningMode,
        "pendingRequests": {},
        "rolesFilled": {},
      },
      "summonerID": localStorage.getItem("summonerID")
    }).then( response => {
      navigate(`/teamPage?teamID=${response.data["id"]}`);
    })
  };

  const isFormValid =
    teamName &&
    teamAcronym &&
    teamJoiningMode;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Team Name:
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </label><br/>
      <label>
        Team Acronym:
        <input
          type="text"
          value={teamAcronym}
          onChange={(e) => setTeamAcronym(e.target.value)}
        />
      </label><br/>
      <label>
        Team Joining Mode:
        <select value={teamJoiningMode} onChange={(e) => setTeamJoiningMode(e.target.value)}>
          <option value="public">public</option>
          <option value="request-only">request-only</option>
          <option value="invite-only">invite-only</option>
        </select>
      </label><br/>
      <button type="submit" disabled={!isFormValid}>Submit</button>
    </form>
  );
}
  
export default LoginGuard(TeamForm);