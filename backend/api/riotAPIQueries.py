from ratelimit import limits, sleep_and_retry
import requests
import os

RIOT_API_KEY = os.environ.get("RIOT_API_KEY")
HTTP_HEADER = {
    'X-Riot-Token': RIOT_API_KEY
}
CALLS = 20
RATE_LIMIT = 60

def getChampionsList():
    version = requests.get("https://ddragon.leagueoflegends.com/api/versions.json").json()[0]
    url = f'http://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json'
    try:
        response = requests.get(url)
        return response.json()
    except Exception as err:
        return err

def championIdToName(championsList, id):
    for champion in championsList["data"]:
        if championsList["data"][champion]["key"] == str(id):
            return champion
    return "NA"

def getSummonerInfo(summonerID):
    url = f'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerID}'
    response = requests.get(url, headers=HTTP_HEADER)
    try:
        response = requests.get(url, headers=HTTP_HEADER)
        return response.json()
    except Exception as err:
        return err

def getSummonerAccountInfo(accountID):
    url = f'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/{accountID}'
    try:
        response = requests.get(url, headers=HTTP_HEADER)
        return response.json()
    except Exception as err:
        return err

@sleep_and_retry
@limits(calls=CALLS, period=RATE_LIMIT)
def getMatchData(matchID):
    url = f'https://americas.api.riotgames.com/lol/match/v5/matches/{matchID}'
    response = requests.get(url, headers=HTTP_HEADER)
    if response.status_code != 200:
        raise Exception('API Response: {}'.format(response.status_code))
    return response.json()

def getChampionMastery(puuid, championID):
    url = f'https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}/by-champion/{championID}'
    response = requests.get(url, headers=HTTP_HEADER)
    return response.json()

def getTopMasteries(id):
    championsList = getChampionsList()
    url = f'https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{id}/top?count=6'
    response = requests.get(url, headers=HTTP_HEADER)
    try:
        response = requests.get(url, headers=HTTP_HEADER)
        masteries = response.json()
        output = []
        for mastery in masteries:
            currMastery = {
                "championName": championIdToName(championsList, mastery["championId"]),
                "masteryLevel": mastery["championLevel"],
                "masteryPoints": mastery["championPoints"],
            }
            output.append(currMastery)
        return output
    except Exception as err:
        return err

def PopulateMatchesData(puuid):
    matches = []
    championData = {}
    url = f'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=50'
    matches += requests.get(url, headers=HTTP_HEADER).json()

    matchCount = 0

    for match in matches:
        matchData = getMatchData(match)
        participants = matchData['metadata']['participants']
        playerIndex = participants.index(puuid)
        playerData = matchData['info']['participants'][playerIndex]

        if playerData['championId'] in championData:
            championData[playerData['championId']]["totalKills"] += playerData['kills']
            championData[playerData['championId']]["totalDeaths"] += playerData['deaths']
            championData[playerData['championId']]["totalAssists"] += playerData['assists']
            championData[playerData['championId']]["wins"] += 1 if playerData['win'] else 0
            championData[playerData['championId']]["gameCount"] += 1
        else:
            championData[playerData['championId']] = {
                "totalKills": playerData['kills'],
                "totalDeaths": playerData['deaths'],
                "totalAssists": playerData['assists'],
                "wins": 1 if playerData['win'] else 0,
                "gameCount": 1,
            }
        
        matchCount += 1
        print("finished " + str(matchCount) + " matche(s)")
            
    return championData

def processChampionsData(puuid, championsData):
    output = []
    for championID in championsData.keys():
        championData = championsData[championID]
        championMastery = getChampionMastery(puuid, championID)
        currChamp = {
            "mastereyLevel": championMastery["championLevel"],
            "mastereyPoints": championMastery["championPoints"],
            "k": round(championData["totalKills"] / championData["gameCount"], 2),
            "d": round(championData["totalDeaths"] / championData["gameCount"], 2),
            "a": round(championData["totalAssists"] / championData["gameCount"], 2),
            "winrate": round(championData["wins"] / championData["gameCount"], 2),
        }
        output.append(currChamp)
    return output