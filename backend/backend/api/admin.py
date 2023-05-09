from django.contrib import admin
from .models import Tournament, Team, RegisteredSummoner

admin.site.register(Tournament)
admin.site.register(Team)
admin.site.register(RegisteredSummoner)
