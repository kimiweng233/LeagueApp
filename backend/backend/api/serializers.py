from rest_framework import serializers
from .models import Tournament, Team

class JSONSerializerField(serializers.Field):

    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return value

class TeamSerializer(serializers.ModelSerializer):

    tournament = serializers.CharField()
    members = JSONSerializerField()

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

