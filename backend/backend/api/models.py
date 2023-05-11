from django.db import models
from django.utils import timezone

class Tournament(models.Model):

    # first element is value in database, second is user facing
    TOURNAMENT_FORMATS = (
        ("1v1", "1v1"),
        ("5v5", "5v5"),
    )

    tournamentName = models.CharField(max_length=100, default="Unnamed Tournament", unique=True)
    tournamentFormat = models.TextField(max_length=10, choices=TOURNAMENT_FORMATS, default="5v5")
    description = models.CharField(max_length=100, default="No Description")
    teamsCap = models.IntegerField(default = 0)
    prizePool = models.FloatField(default=0.0)
    registrationFee = models.FloatField(default=0.0)
    startTime = models.DateTimeField(default=timezone.now)
    started = models.BooleanField(default=False)
    ended = models.BooleanField(default=False)

class Team(models.Model):

    TEAM_JOINING_MODES = (
        ("public", "public"),
        ("request-only", "request-only"),
        ("invite-only", "invite-only"),
    )

    teamName = models.TextField(max_length=100, default="Unnamed Team", unique=True)
    teamAcronym = models.TextField(max_length=3, default="NUL", unique=True)
    tournament = models.ForeignKey(Tournament, related_name="teams", on_delete=models.CASCADE)
    teamJoiningMode = models.TextField(max_length=12, choices=TEAM_JOINING_MODES, default="public")
    pendingRequests = models.JSONField(default=dict)
    rolesFilled = models.JSONField(default={
        "Top": "",
        "Jungle": "",
        "Mid": "",
        "Bot": "",
        "Support": "",
    })

class Summoner(models.Model):

    summonerID = models.TextField(max_length=16, default="No Name", unique=True)
    accountID = models.TextField(default="No ID")
    registeredTournaments = models.ManyToManyField(Tournament)
    registeredTeams = models.ManyToManyField(Team)