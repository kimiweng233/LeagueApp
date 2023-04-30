from rest_framework import serializers
from .models import Tournament, Team


class TeamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Team
        fields = ('id', 'teamName')

class TournamentSerializer(serializers.ModelSerializer):

    teams = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=Team.objects.all())

    class Meta:
        model = Tournament
        fields = ('id', 'tournamentName', 'tournamentFormat', 'description', 'participantsCap', 'prizePool', 'registrationFee', 'teams', 'ended')

