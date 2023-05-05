import http from "./http-common";

const getTournamentsList = () => {
  return http.get(`/getTournamentsList/`);
};

const createTournament = (data) => {
  return http.post(`/createTournament/`, data);
};

const createTeam = (data) => {
  return http.post(`/createTeam/`, data);
};

const getTeamsList = (data) => {
  return http.post(`/getTeamsList/`, data);
};

const getTeamData = (data) => {
  return http.post(`/getTeamData/`, data);
};

const getTournamentData = (data) => {
  return http.post(`/getTournamentData/`, data);
};

const functions = {
  getTournamentsList,
  createTournament,
  createTeam,
  getTeamsList,
  getTeamData,
  getTournamentData,
};

export default functions