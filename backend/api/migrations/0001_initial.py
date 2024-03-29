# Generated by Django 4.1.5 on 2023-06-05 20:38

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Tournament",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "tournamentName",
                    models.CharField(
                        default="Unnamed Tournament", max_length=100, unique=True
                    ),
                ),
                (
                    "tournamentFormat",
                    models.TextField(
                        choices=[("1v1", "1v1"), ("5v5", "5v5")],
                        default="5v5",
                        max_length=10,
                    ),
                ),
                (
                    "description",
                    models.CharField(default="No Description", max_length=100),
                ),
                ("teamsCap", models.IntegerField(default=0)),
                ("prizePool", models.FloatField(default=0.0)),
                ("registrationFee", models.FloatField(default=0.0)),
                ("startTime", models.DateTimeField(default=django.utils.timezone.now)),
                ("started", models.BooleanField(default=False)),
                ("ended", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="Team",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "teamName",
                    models.TextField(
                        default="Unnamed Team", max_length=100, unique=True
                    ),
                ),
                (
                    "teamAcronym",
                    models.TextField(default="NUL", max_length=3, unique=True),
                ),
                (
                    "teamJoiningMode",
                    models.TextField(
                        choices=[
                            ("public", "public"),
                            ("request-only", "request-only"),
                            ("invite-only", "invite-only"),
                        ],
                        default="public",
                        max_length=12,
                    ),
                ),
                ("rolesFilled", models.JSONField(default=dict)),
                ("inviteCode", models.TextField(default="AAAAAA", max_length=6)),
                (
                    "tournament",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="teams",
                        to="api.tournament",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Summoner",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "summonerID",
                    models.TextField(default="No Name", max_length=16, unique=True),
                ),
                ("accountID", models.TextField(default="No ID")),
                ("profilePicture", models.IntegerField(default=1)),
                ("tier", models.TextField(blank=True, default=None, null=True)),
                ("rank", models.TextField(blank=True, default=None, null=True)),
                ("gameCount", models.IntegerField(blank=True, default=None, null=True)),
                ("winrate", models.FloatField(blank=True, default=None, null=True)),
                (
                    "registeredTeams",
                    models.ManyToManyField(related_name="members", to="api.team"),
                ),
                ("registeredTournaments", models.ManyToManyField(to="api.tournament")),
                (
                    "requestedTeams",
                    models.ManyToManyField(related_name="requests", to="api.team"),
                ),
            ],
        ),
    ]
