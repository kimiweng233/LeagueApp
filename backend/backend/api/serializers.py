from rest_framework import serializers
from .models import Tournament, Team, Summoner

class JSONSerializerField(serializers.Field):

    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return value

class TeamSerializer(serializers.ModelSerializer):

    tournament = serializers.CharField()
    rolesFilled = JSONSerializerField()
    pendingRequests = JSONSerializerField()

    class Meta:
        model = Team
        fields = '__all__'

    def create(self, validated_data):
        tournament = validated_data.pop('tournament')
        tournamentEntry = Tournament.objects.get(id=tournament)
        teamInstance = Team.objects.create(**validated_data, tournament=tournamentEntry)
        return teamInstance

class TournamentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tournament
        fields = '__all__'

class SummonerSerializer(serializers.ModelSerializer):

    # registeredTournaments = TournamentSerializer
    # registeredTeams = TeamSerializer

    class Meta:
        model = Summoner
        fields = ("summonerID",)