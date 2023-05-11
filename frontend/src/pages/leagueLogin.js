import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import services from '../services'

function LeagueLogin() {
  const [summonerID, setSummonerID] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("summonerID") !== null) {
      navigate("/");
    }
  }, [navigate])

  const handleSubmit = (event) => {
    event.preventDefault();
    services.summonerLogin({"summonerID": summonerID}).then( response => {
        localStorage.setItem("summonerID", summonerID);
        navigate("/");
    }).catch( error => {
        // error handling later
    })
  }

  const handleChange = (event) => {
    setSummonerID(event.target.value.slice(0, 16));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        SummonerID:
        <input type="text" value={summonerID} maxLength={16} onChange={handleChange} />
      </label>
      <br />
      <button type="submit" disabled={!summonerID}>Login</button>
    </form>
  );
}

export default LeagueLogin;