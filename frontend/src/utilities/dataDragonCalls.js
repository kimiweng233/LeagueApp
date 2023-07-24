const getMostRecentDataDragonVersion = async () => {
    return fetch("https://ddragon.leagueoflegends.com/api/versions.json")
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        });
};

export const getSummonerIcon = async (id) => {
    const version = await getMostRecentDataDragonVersion();
    return `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${id}.png`;
};

export const getChampionIcon = async (champions) => {
    const version = await getMostRecentDataDragonVersion();
    const sources = champions.map(
        (championData) =>
            `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championData["championName"]}.png`
    );
    return sources;
};
