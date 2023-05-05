import React, { useState } from "react";

import services from '../services'

function TournamentForm() {
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentFormat, setTournamentFormat] = useState("5v5");
  const [description, setDescription] = useState("");
  const [teamsCap, setTeamsCap] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    services.createTournament({
      "tournamentName": tournamentName,
      "tournamentFormat": tournamentFormat,
      "description": description,
      "teamsCap": teamsCap,
      "prizePool": prizePool,
      "registrationFee": registrationFee,
      "startTime": startTime,
      "teams": {}
    })
  };

  const isFormValid =
    tournamentName &&
    description &&
    teamsCap &&
    prizePool &&
    registrationFee &&
    startTime;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Tournament Name:
        <input
          type="text"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
        />
      </label><br/>
      <label>
        Tournament Format:
        <select value={tournamentFormat} onChange={(e) => setTournamentFormat(e.target.value)}>
          <option value="5v5">5v5</option>
          <option value="1v1">1v1</option>
        </select>
      </label><br/>
      <label>
        Tournament Description:
        <textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label><br/>
      <label>
        Number of Teams Participating:
        <input
          type="number"
          value={teamsCap}
          onChange={(e) => setTeamsCap(e.target.value)}
        />
      </label><br/>
      <label>
        Prize Pool:
        <input
          type="number"
          value={prizePool}
          onChange={(e) => setPrizePool(e.target.value)}
        />
      </label><br/>
      <label>
        Registration Fee:
        <input
          type="number"
          value={registrationFee}
          onChange={(e) => setRegistrationFee(e.target.value)}
        />
      </label><br/>
      <label>
        Start Time:
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label><br/>
      <button type="submit" disabled={!isFormValid}>Submit</button>
    </form>
  );
}
  
export default TournamentForm;