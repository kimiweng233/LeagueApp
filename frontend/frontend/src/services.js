import http from "./http-common";

const getTournamentsList = () => {
  return http.get(`/getTournamentsList/`);
};

const functions = {
    getTournamentsList,
};

export default functions