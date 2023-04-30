from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import TeamSerializer, TournamentSerializer    
from .models import Tournament, Team

@api_view(['GET'])
def getTournamentsList(request):
    tournaments = Tournament.objects.all()
    serializer = TournamentSerializer(tournaments, many=True)
    return Response(serializer.data)