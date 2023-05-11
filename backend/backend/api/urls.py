from django.urls import path
from . import views

urlpatterns = [
    path('getTournamentsList/', views.getTournamentsList),
    path('createTournament/', views.createTournament),
    path('createTeam/', views.createTeam),
    path('getTeamsList/', views.getTeamsList),
    path('getTeamData/', views.getTeamData),
    path('getTournamentData/', views.getTournamentData),
    path('summonerLogin/', views.summonerLogin),
    path('joinTeam/', views.joinTeam),
    path('getTournamentsJoined/', views.getTournamentsJoined),
    path('getTeamsJoined/', views.getTeamsJoined),
]