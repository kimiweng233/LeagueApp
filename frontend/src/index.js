import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';

import Home from './pages/home';
import TournamentForm from './pages/tournamentCreation';
import TournamentsList from './pages/tournamentsList';
import TeamForm from './pages/teamCreation';
import TeamsList from './pages/teamsList';
import TeamMenu from './pages/teamMenu';
import TournamentMenu from './pages/tournamentMenu';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route exact path='/createTournament' element={<TournamentForm/>} />
          <Route exact path='/tournaments' element={<TournamentsList/>} />
          <Route exact path='/createTeam' element={<TeamForm/>} />
          <Route exact path='/teams' element={<TeamsList/>} />
          <Route exact path='/teamPage' element={<TeamMenu/>} />
          <Route exact path='/tournamentPage' element={<TournamentMenu/>} />
          <Route exact path='/*' element={<Home/>} />
      </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
