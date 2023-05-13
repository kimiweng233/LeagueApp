from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.forms.models import model_to_dict

from .serializers import TeamSerializer, TournamentSerializer, SummonerSerializer  
from .models import Tournament, Team, Summoner

import requests

RIOT_API_ROOT="https://na1.api.riotgames.com"
RIOT_API_KEY="RGAPI-52d25333-d8f0-47e2-880f-e316b83af76e"

def apiHelper(apiEndPoint, apiParam):
    return requests.get(RIOT_API_ROOT + apiEndPoint + apiParam + "?api_key=" + RIOT_API_KEY)

@api_view(['GET'])
def getTournamentsList(request):
    tournaments = Tournament.objects.filter(ended=False).all()
    serializer = TournamentSerializer(tournaments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def createTournament(request):
    serializer = TournamentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        print(serializer.errors)
        return Response(serializer.errors)
    
@api_view(['POST'])
def createTeam(request):
    serializer = TeamSerializer(data=request.data["teamData"])
    team = None
    if serializer.is_valid():
        team = serializer.save()
    else:
        print(serializer.errors)
        return Response(serializer.errors)
    
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    summoner.registeredTeams.add(team)
    summoner.registeredTournaments.add(team.tournament)
    summoner.save()
    
    return Response({"id": team.id})

@api_view(['POST'])
def getTeamsList(request):
    tournament = Tournament.objects.get(pk=request.data["id"])
    teams = list(tournament.teams.values())
    return Response({"teams": teams})

@api_view(['POST'])
def getTeamData(request):
    team = Team.objects.filter(id=request.data["id"]).first()    
    teamData = model_to_dict(team)
    members = SummonerSerializer(team.summoner_set.all(), many=True).data
    requests = SummonerSerializer(team.requests.all(), many=True).data
    teamData["members"] = getSummonerInfo(members)
    teamData["requests"] = getSummonerInfo(requests)
    return Response({"team": teamData})

def getSummonerInfo(summoners):
    out = summoners
    for summoner in out:
        accountInfo = apiHelper("/lol/league/v4/entries/by-summoner/", summoner["accountID"]).json()
        for queue in accountInfo:
            if queue["queueType"] == "RANKED_SOLO_5x5":
                summoner["rank"] = queue["tier"]
                break
        else:
            summoner["rank"] = None
    return out

@api_view(['POST'])
def getTournamentData(request):
    tournament = Tournament.objects.filter(id=request.data["id"]).first()
    tournamentData = model_to_dict(tournament)
    tournamentData["teams"] = list(tournament.teams.values())
    return Response({"tournament": tournamentData})

@api_view(['POST'])
def summonerLogin(request):
    if not Summoner.objects.filter(summonerID=request.data["summonerID"]).exists():
        summonerLookup = requests.get(RIOT_API_ROOT + 
                                "/lol/summoner/v4/summoners/by-name/" + request.data["summonerID"] + 
                                "?api_key=" + RIOT_API_KEY)
        if summonerLookup.status_code == 404:
            return Response({'message':'Summoner ID Not Found'}, 404)
        summoner = Summoner(summonerID=request.data["summonerID"], accountID=summonerLookup.json()["id"])
        summoner.save()

    return Response(404)

@api_view(['POST'])
def joinTeam(request):
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    team = Team.objects.get(pk=request.data["teamID"])
    summoner.registeredTeams.add(team)
    summoner.registeredTournaments.add(team.tournament)
    if summoner.requestedTeams.filter(pk=team.pk).exists():
        summoner.requestedTeams.remove(team)
    summoner.save()
    return Response(200)

@api_view(['POST'])
def getTournamentsJoined(request):
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    serializer = TournamentSerializer(summoner.registeredTournaments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def getTeamsJoined(request):
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    serializer = TeamSerializer(summoner.registeredTeams, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def changeTeamRole(request):
    team = Team.objects.filter(id=request.data["teamID"]).first()
    for role, summoner in team.rolesFilled.items():
        if summoner == request.data["summonerID"]:
            team.rolesFilled[role] = None
    team.rolesFilled[request.data["newRole"]] = request.data["summonerID"]
    team.save()
    return Response(200)

@api_view(['POST'])
def requestJoin(request):
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    team = Team.objects.get(pk=request.data["teamID"])
    summoner.requestedTeams.add(team)
    summoner.save()
    return Response(200)