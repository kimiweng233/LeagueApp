import http from "./http-common";

const getTournamentsList = () => {
    return http.get(`/getTournamentsList/`).then((response) => {
        return response.data;
    });
};

const createTournament = (data) => {
    return http.post(`/createTournament/`, data).then((response) => {
        return response.data;
    });
};

const createTeam = (data) => {
    return http.post(`/createTeam/`, data).then((response) => {
        return response.data;
    });
};

const getTeamData = (data) => {
    return http.post(`/getTeamData/`, data).then((response) => {
        return response.data;
    });
};

const getTeamPublicData = (data) => {
    return http.post(`/getTeamPublicData/`, data).then((response) => {
        return response.data;
    });
};

const getTournamentData = (data) => {
    return http.post(`/getTournamentData/`, data).then((response) => {
        return response.data;
    });
};

const summonerLogin = (data) => {
    return http.post(`/summonerLogin/`, data).then((response) => {
        return response.data;
    });
};

const joinTeam = (data) => {
    return http.post(`/joinTeam/`, data);
};

const getTournamentsJoined = (data) => {
    return http.post(`/getTournamentsJoined/`, data).then((response) => {
        return response.data;
    });
};

const getTeamsJoined = (data) => {
    return http.post(`/getTeamsJoined/`, data).then((response) => {
        return response.data;
    });
};

const changeTeamRole = (data) => {
    return http.post(`/changeTeamRole/`, data);
};

const removeTeamRole = (data) => {
    return http.post(`/removeTeamRole/`, data);
};

const requestJoin = (data) => {
    return http.post(`/requestJoin/`, data);
};

const rejectJoinRequest = (data) => {
    return http.post(`/rejectJoinRequest/`, data);
};

const checkIfJoinedTournament = (data) => {
    return http.post(`/checkIfJoinedTournament/`, data).then((response) => {
        return response.data;
    });
};

const removeFromTeam = (data) => {
    return http.post(`/removeFromTeam/`, data);
};

const updateSummonerInfo = (data) => {
    return http.post(`/updateSummonerInfo/`, data);
};

const changeTeamJoiningMode = (data) => {
    return http.post(`/changeTeamJoiningMode/`, data).then((response) => {
        return response.data;
    });
};

const checkIfRequestedTeam = (data) => {
    return http.post(`/checkIfRequestedTeam/`, data).then((response) => {
        return response.data;
    });
};

const getTeamsWithVacancy = (data) => {
    return http.post(`/getTeamsWithVacancy/`, data).then((response) => {
        return response.data;
    });
};

const getTeamsWithVacancyPaginated = (data) => {
    return http
        .post(`/getTeamsWithVacancyPaginated/`, data)
        .then((response) => {
            return response.data;
        });
};

const quickJoin = (data) => {
    return http.post(`/quickJoin/`, data).then((response) => {
        return response.data;
    });
};

const updateBracketScore = (data) => {
    return http.post(`/updateBracketScore/`, data).then((response) => {
        return response.data;
    });
};

const declareRoundWinner = (data) => {
    return http.post(`/declareRoundWinner/`, data).then((response) => {
        return response.data;
    });
};

const endTournament = (data) => {
    return http.post(`/endTournament/`, data);
};

const startTournament = (data) => {
    return http.post(`/startTournament/`, data);
};

const updateTournamentTeams = (data) => {
    return http.post(`/updateTournamentTeams/`, data).then((response) => {
        return response.data;
    });
};

const updateTournamentData = (data) => {
    return http.post(`/updateTournamentData/`, data);
};

const functions = {
    getTournamentsList,
    createTournament,
    createTeam,
    getTeamData,
    getTeamPublicData,
    getTournamentData,
    summonerLogin,
    joinTeam,
    getTournamentsJoined,
    getTeamsJoined,
    changeTeamRole,
    removeTeamRole,
    requestJoin,
    checkIfJoinedTournament,
    removeFromTeam,
    updateSummonerInfo,
    changeTeamJoiningMode,
    checkIfRequestedTeam,
    getTeamsWithVacancy,
    quickJoin,
    rejectJoinRequest,
    updateBracketScore,
    declareRoundWinner,
    endTournament,
    updateTournamentTeams,
    startTournament,
    updateTournamentData,
    getTeamsWithVacancyPaginated,
};

export default functions;
