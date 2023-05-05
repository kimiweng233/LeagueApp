from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.forms.models import model_to_dict

from .serializers import TeamSerializer, TournamentSerializer    
from .models import Tournament, Team

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
    serializer = TeamSerializer(data=request.data)
    if serializer.is_valid():
        team = serializer.save()
        return Response({"id": team.id})
    else:
        print(serializer.errors)
        return Response(serializer.errors)

@api_view(['POST'])
def getTeamsList(request):
    tournament = Tournament.objects.get(pk=request.data["id"])
    teams = list(tournament.teams.values())
    return Response({"teams": teams})

@api_view(['POST'])
def getTeamData(request):
    team = Team.objects.filter(id=request.data["id"]).first()
    return Response({"team": model_to_dict(team)})

@api_view(['POST'])
def getTournamentData(request):
    tournament = Tournament.objects.filter(id=request.data["id"]).first()
    tournamentData = model_to_dict(tournament)
    tournamentData["teams"] = list(tournament.teams.values())
    return Response({"tournament": tournamentData})