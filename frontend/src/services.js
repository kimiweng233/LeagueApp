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

const summonerLogin = (data) => {
  return http.post(`/summonerLogin/`, data);
};

const joinTeam = (data) => {
  return http.post(`/joinTeam/`, data);
};

const getTournamentsJoined = (data) => {
  return http.post(`/getTournamentsJoined/`, data);
};

const getTeamsJoined = (data) => {
  return http.post(`/getTeamsJoined/`, data);
};

const changeTeamRole = (data) => {
  return http.post(`/changeTeamRole/`, data);
};

const requestJoin = (data) => {
  return http.post(`/requestJoin/`, data);
};

const functions = {
  getTournamentsList,
  createTournament,
  createTeam,
  getTeamsList,
  getTeamData,
  getTournamentData,
  summonerLogin,
  joinTeam,
  getTournamentsJoined,
  getTeamsJoined,
  changeTeamRole,
  requestJoin,
};

export default functions