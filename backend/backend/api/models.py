from django.db import models

class Tournament(models.Model):

    # first element is value in database, second is user facing
    TOURNAMENT_FORMATS = (
        ("1v1", "1v1"),
        ("5v5", "5v5"),
    )

    tournamentName = models.CharField(max_length=100, default="Unnamed Tournament")
    tournamentFormat = models.TextField(max_length=10, choices=TOURNAMENT_FORMATS, default="5v5")
    description = models.CharField(max_length=100, default="No Description")
    participantsCap = models.IntegerField(default = 0)
    prizePool = models.FloatField(default=0.0)
    registrationFee = models.FloatField(default=0.0)
    ended = models.BooleanField(default=False)

class Team(models.Model):
    teamName = models.TextField(max_length=100, default="Unnamed Team")
    tournament = models.ForeignKey(Tournament, related_name="teams", on_delete=models.CASCADE)