from django.urls import path
from . import views

urlpatterns = [
    path('getTournamentsList/', views.getTournamentsList),
    path('createTournament/', views.createTournament),
    path('createTeam/', views.createTeam),
    path('getTeamData/', views.getTeamData),
    path('getTournamentData/', views.getTournamentData),
    path('summonerLogin/', views.summonerLogin),
    path('joinTeam/', views.joinTeam),
    path('rejectJoinRequest/', views.rejectJoinRequest),
    path('getTournamentsJoined/', views.getTournamentsJoined),
    path('getTeamsJoined/', views.getTeamsJoined),
    path('changeTeamRole/', views.changeTeamRole),
    path('removeTeamRole/', views.removeTeamRole),
    path('requestJoin/', views.requestJoin),
    path('checkIfJoinedTournament/', views.checkIfJoinedTournament),
    path('removeFromTeam/', views.removeFromTeam),
    path('updateSummonerInfo/', views.updateSummonerInfo),
    path('changeTeamJoiningMode/', views.changeTeamJoiningMode),
    path('checkIfRequestedTeam/', views.checkIfRequestedTeam),
    path('getTeamsWithVacancy/', views.getTeamsWithVacancy),
    path('quickJoin/', views.quickJoin),
]