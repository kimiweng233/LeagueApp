from rest_framework import serializers
from .models import Tournament, Team, Summoner
from django.db.models import Q


class JSONSerializerField(serializers.Field):
    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return value


class SummonerSerializer(serializers.ModelSerializer):
    topMasteries = JSONSerializerField()

    class Meta:
        model = Summoner
        fields = (
            "id",
            "summonerID",
            "tier",
            "rank",
            "gameCount",
            "winrate",
            "profilePicture",
            "topMasteries",
        )


class TeamSerializer(serializers.ModelSerializer):
    tournament = serializers.CharField()
    rolesFilled = JSONSerializerField()
    members = SummonerSerializer(many=True)

    class Meta:
        model = Team
        fields = (
            "id",
            "teamName",
            "teamAcronym",
            "tournament",
            "teamJoiningMode",
            "rolesFilled",
            "inviteCode",
            "members",
        )

    def validate(self, data):
        tournament = data["tournament"]
        tournamentEntry = Tournament.objects.get(id=tournament)
        condition = Q(teamName=data["teamName"]) | Q(teamAcronym=data["teamAcronym"])
        if tournamentEntry.teams.all().filter(condition).exists():
            raise serializers.ValidationError("Team name and/or acronym already exists")
        data = super().validate(data)
        return data

    def create(self, validated_data):
        tournament = validated_data.pop("tournament")
        tournamentEntry = Tournament.objects.get(id=tournament)
        validated_data.pop("members")
        teamInstance = Team.objects.create(**validated_data, tournament=tournamentEntry)
        return teamInstance


class TournamentSerializer(serializers.ModelSerializer):
    teams = TeamSerializer(many=True)

    class Meta:
        model = Tournament
        fields = (
            "id",
            "tournamentName",
            "tournamentFormat",
            "description",
            "teamsCap",
            "prizePool",
            "registrationFee",
            "startTime",
            "started",
            "teams",
            "bracket",
            "liveLink",
        )

    def create(self, validated_data):
        validated_data.pop("teams")
        tournamentInstance = Tournament.objects.create(**validated_data)
        return tournamentInstance
