from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.forms.models import model_to_dict
from django.db.models import Count, Q
from django.core.paginator import Paginator

from .serializers import TeamSerializer, TournamentSerializer, SummonerSerializer
from .models import Tournament, Team, Summoner
from .riotAPIQueries import getSummonerInfo, getSummonerAccountInfo, getTopMasteries

import random
import string
import time
import math


@api_view(["GET"])
def getTournamentsList(request):
    ongoingTournaments = Tournament.objects.filter(started=True).all()
    openTournaments = Tournament.objects.filter(started=False).all()
    ongoingTournamentsSerializer = TournamentSerializer(ongoingTournaments, many=True)
    openTournamentsSerializer = TournamentSerializer(openTournaments, many=True)
    return Response(
        {
            "ongoing": ongoingTournamentsSerializer.data,
            "open": openTournamentsSerializer.data,
        }
    )


@api_view(["POST"])
def createTournament(request):
    try:
        serializer = TournamentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data["id"], 200)
        else:
            _, first_error = next(iter(serializer.errors.items()))
            return Response(
                first_error[0], status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    except Exception as e:
        return Response(
            "Error creating tournament, please try again",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def createTeam(request):
    try:
        teamID = createTeamFunc(
            request.data["teamData"]["tournament"], request.data["teamData"]
        )
        team = Team.objects.filter(id=teamID).first()
        joinTeamFunc(request.data["summonerID"], teamID)
        if team.teamJoiningMode == "public":
            while (
                team.members.all().count() < 5
                and team.tournament.quickJoinQueue.all().count() > 0
            ):
                joinTeamFunc(
                    team.tournament.quickJoinQueue.all().first().summonerID, teamID
                )
        elif team.teamJoiningMode == "request-only":
            for summoner in team.tournament.quickJoinQueue.all():
                summoner.requestedTeams.add(team)
                summoner.save()
        return Response(teamID, 200)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def createTeamFunc(tournamentID, teamData):
    tournament = Tournament.objects.get(pk=tournamentID)
    if len(tournament.teams.all()) >= tournament.teamsCap:
        raise Exception("tournament is full")
    serializer = TeamSerializer(data=teamData)
    team = None
    if serializer.is_valid():
        team = serializer.save()
    else:
        _, first_error = next(iter(serializer.errors.items()))
        raise Exception(first_error[0])
    return team.id


@api_view(["POST"])
def getTeamData(request):
    team = Team.objects.filter(id=request.data["id"]).first()
    teamData = model_to_dict(team)
    members = SummonerSerializer(team.members.all(), many=True).data
    requests = SummonerSerializer(team.requests.all(), many=True).data
    teamData["members"] = members
    teamData["requests"] = requests
    return Response(teamData)


@api_view(["POST"])
def getTeamPublicData(request):
    team = Team.objects.filter(id=request.data["id"]).first()
    teamData = model_to_dict(team)
    members = SummonerSerializer(team.members.all(), many=True).data
    teamData["members"] = members
    return Response(teamData)


@api_view(["POST"])
def getTournamentData(request):
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    tournament = Tournament.objects.filter(id=request.data["tournamentID"]).first()
    tournamentData = model_to_dict(tournament)
    tournamentData["teams"] = [
        appendMembersCount(team) for team in tournament.teams.all()
    ]
    tournamentData["quickJoinQueue"] = [
        SummonerSerializer(summoner).data["summonerID"]
        for summoner in tournamentData["quickJoinQueue"]
    ]
    if summoner.registeredTournaments.all().filter(pk=tournament.id).exists():
        for team in summoner.registeredTeams.all():
            if team.tournament.id == tournament.id:
                tournamentData["summonerTeam"] = team.teamName
    return Response(tournamentData)


def appendMembersCount(team):
    out = model_to_dict(team)
    out["membersCount"] = len(team.members.all())
    return out


@api_view(["POST"])
def summonerLogin(request):
    if not Summoner.objects.filter(summonerID=request.data["summonerID"]).exists():
        summonerLookup = getSummonerInfo(request.data["summonerID"])
        if "status" in summonerLookup:
            return Response(
                "Summoner does not exist, please check your spelling!",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        if summonerLookup["name"] != request.data["summonerID"]:
            return Response(
                "Make sure capitalization and spaces are exact matches!",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        summoner = Summoner(summonerID=request.data["summonerID"])
        summoner.save()
        try:
            populateSummonerInfo(summoner.summonerID)
            return Response(summoner.role, 200)
        except Exception as err:
            summoner.delete()
            return Response(
                "Error linking account, please try again!",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        summoner = Summoner.objects.filter(
            summonerID=request.data["summonerID"]
        ).first()
    return Response(summoner.role, 200)


@api_view(["POST"])
def updateSummonerInfo(request):
    populateSummonerInfo(request.data["summonerID"])
    return Response(200)


def populateSummonerInfo(summonerID):
    summonerLookup = getSummonerInfo(summonerID)
    summonerInfo = getSummonerProcessedInfo(summonerLookup["id"])
    summoner = Summoner.objects.filter(summonerID=summonerID).first()

    summoner.profilePicture = summonerLookup["profileIconId"]
    summoner.tier = summonerInfo["tier"]
    summoner.rank = summonerInfo["rank"]
    summoner.gameCount = summonerInfo["gameCount"]
    summoner.winrate = summonerInfo["winrate"]
    summoner.topMasteries = {"topMasteries": summonerInfo["topMasteries"]}

    summoner.save()


def getSummonerProcessedInfo(accountID):
    summonerInfo = {}
    accountInfo = getSummonerAccountInfo(accountID)
    masteriesInfo = getTopMasteries(accountID)
    if len(accountInfo) == 0:
        summonerInfo["tier"] = None
        summonerInfo["rank"] = None
        summonerInfo["gameCount"] = 0
        summonerInfo["winrate"] = 0
        summonerInfo["topMasteries"] = masteriesInfo
        return summonerInfo
    for queue in accountInfo:
        if queue["queueType"] == "RANKED_SOLO_5x5":
            summonerInfo["tier"] = queue["tier"]
            summonerInfo["rank"] = queue["rank"]
            break
    else:
        summonerInfo["tier"] = None
        summonerInfo["rank"] = None
    summonerInfo["gameCount"] = int(queue["wins"]) + int(queue["losses"])
    summonerInfo["winrate"] = round(
        int(queue["wins"]) / summonerInfo["gameCount"] * 100, 2
    )
    summonerInfo["topMasteries"] = masteriesInfo
    return summonerInfo


@api_view(["POST"])
def joinTeam(request):
    try:
        team = Team.objects.get(pk=request.data["teamID"])
        if team.members.all().count() > 5:
            Response(
                "Team capacity reached!", status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        if team.tournament.started:
            Response(
                "Team joining phase has ended!",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        joinTeamFunc(request.data["summonerID"], request.data["teamID"])
        return Response(200)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def rejectJoinRequest(request):
    try:
        summoner = Summoner.objects.filter(
            summonerID=request.data["summonerID"]
        ).first()
        team = Team.objects.get(pk=request.data["teamID"])
        summoner.requestedTeams.remove(team)
        summoner.save()
        return Response(200)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def joinTeamFunc(summonerID, teamID):
    summoner = Summoner.objects.filter(summonerID=summonerID).first()
    team = Team.objects.get(pk=teamID)
    if not summoner.registeredTournaments.filter(pk=team.tournament.id).exists():
        summoner.registeredTeams.add(team)
        summoner.registeredTournaments.add(team.tournament)
        for requestTeam in summoner.requestedTeams.all():
            summoner.requestedTeams.remove(requestTeam)
        if team.tournament.quickJoinQueue.filter(summonerID=summonerID).exists():
            team.tournament.quickJoinQueue.remove(summoner)
        summoner.save()
    else:
        raise Exception("Summoner already joined a team")


@api_view(["POST"])
def getTournamentsJoined(request):
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    ids = list(summoner.registeredTournaments.values_list("id", flat=True))
    return Response(ids)


@api_view(["POST"])
def getTeamsJoined(request):
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    processedTeamData = []
    for team in summoner.registeredTeams.all():
        teamData = TeamSerializer(team)
        processedTeam = {
            "teamData": teamData.data,
            "tournamentTime": team.tournament.startTime,
        }
        processedTeamData.append(processedTeam)
    return Response(processedTeamData)


@api_view(["POST"])
def changeTeamRole(request):
    team = Team.objects.filter(id=request.data["teamID"]).first()
    for role, summoner in team.rolesFilled.items():
        if summoner == request.data["summonerID"]:
            team.rolesFilled[role] = None
    team.rolesFilled[request.data["newRole"]] = request.data["summonerID"]
    team.save()
    return Response(200)


@api_view(["POST"])
def removeTeamRole(request):
    team = Team.objects.filter(id=request.data["teamID"]).first()
    for role, summoner in team.rolesFilled.items():
        if summoner == request.data["summonerID"]:
            team.rolesFilled[role] = None
    team.save()
    return Response(200)


@api_view(["POST"])
def requestJoin(request):
    try:
        summoner = Summoner.objects.filter(
            summonerID=request.data["summonerID"]
        ).first()
        team = Team.objects.get(pk=request.data["teamID"])
        if team.teamJoiningMode != "public":
            summoner.requestedTeams.add(team)
            summoner.save()
            return Response(200)
        else:
            return Response("Cannot send request because team is public")
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def checkIfJoinedTournament(request):
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    status = summoner.registeredTournaments.filter(
        pk=request.data["tournamentID"]
    ).exists()
    return Response(status)


@api_view(["POST"])
def removeFromTeam(request):
    try:
        summoner = Summoner.objects.filter(
            summonerID=request.data["summonerID"]
        ).first()
        team = Team.objects.get(pk=request.data["teamID"])
        summoner.registeredTeams.remove(team)
        summoner.registeredTournaments.remove(team.tournament)
        summoner.save()
        if team.members.all().count() == 0:
            team.delete()
        else:
            for role, summoner in team.rolesFilled.items():
                if summoner == request.data["summonerID"]:
                    team.rolesFilled[role] = None
            if (
                team.tournament.quickJoinQueue.all().count() > 0
                and team.teamJoiningMode == "public"
            ):
                joinTeamFunc(
                    team.tournament.quickJoinQueue.all().first().summonerID, team.id
                )
            team.save()
        return Response(200)
    except Exception as e:
        return Response(
            "Error leaving team!",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def changeTeamJoiningMode(request):
    try:
        team = Team.objects.get(pk=request.data["teamID"])
        team.teamJoiningMode = request.data["newJoiningMode"]
        if request.data["newJoiningMode"] == "public":
            for summoner in team.requests.all():
                if team.members.all().count() < 5:
                    joinTeamFunc(summoner.summonerID, team.id)
                summoner.requestedTeams.remove(team)
            for summoner in team.tournament.quickJoinQueue.all():
                if team.members.all().count() < 5:
                    joinTeamFunc(summoner.summonerID, team.id)
        elif request.data["newJoiningMode"] == "request-only":
            for summoner in team.tournament.quickJoinQueue.all():
                summoner.requestedTeams.add(team)
                summoner.save()
        elif request.data["newJoiningMode"] == "invite-only":
            for summoner in team.requests.all():
                summoner.requestedTeams.remove(team)
        team.save()
        return Response(team.teamJoiningMode)
    except Exception as e:
        return Response(
            "Error changing team joining mode!",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def checkIfRequestedTeam(request):
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    status = summoner.requestedTeams.filter(pk=request.data["teamID"]).exists()
    return Response(status)


@api_view(["POST"])
def rejectJoinRequest(request):
    summoner = Summoner.objects.filter(summonerID=request.data["summonerID"]).first()
    team = Team.objects.get(pk=request.data["teamID"])
    summoner.requestedTeams.remove(team)
    summoner.save()
    return Response(200)


@api_view(["POST"])
def getTeamsWithVacancy(request):
    query = Q()
    for role in request.data["desiredRoles"]:
        query |= Q(**{f"rolesFilled__{role}": None})
    tournament = Tournament.objects.get(pk=request.data["tournamentID"])
    teams = (
        tournament.teams.annotate(membersCount=Count("members"))
        .filter(Q(membersCount__lt=5) & query)
        .exclude(teamJoiningMode="invite-only")
    )
    serializer = TeamSerializer(teams, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def getTeamsWithVacancyPaginated(request):
    tournament = Tournament.objects.get(pk=request.data["tournamentID"])
    teams = (
        tournament.teams.annotate(membersCount=Count("members"))
        .filter(Q(membersCount__lt=5))
        .exclude(teamJoiningMode="invite-only")
    )
    paginator = Paginator(teams, request.data["perPage"])
    page_data = paginator.page(request.data["pageNum"])
    serializerData = TeamSerializer(page_data, many=True).data
    return Response({"teams": serializerData, "isLastPage": not page_data.has_next()})


@api_view(["POST"])
def quickJoin(request):
    try:
        summoner = Summoner.objects.filter(
            summonerID=request.data["summonerID"]
        ).first()
        tournament = Tournament.objects.get(pk=request.data["tournamentID"])
        openPublicTeams = (
            tournament.teams.all()
            .annotate(membersCount=Count("members"))
            .filter(Q(membersCount__lt=5) & Q(teamJoiningMode__exact="public"))
            .order_by("-membersCount")
        )
        if openPublicTeams.count() > 0:
            joinTeamFunc(request.data["summonerID"], openPublicTeams.first().id)
            return Response(
                {"message": "Joined Team", "id": openPublicTeams.first().id}, 200
            )
        else:
            if (
                tournament.quickJoinQueue.count() > 4
                and tournament.teams.count() < tournament.teamsCap
            ):
                teamID = createTeamFunc(
                    request.data["tournamentID"],
                    {
                        "teamName": "Team " + str(tournament.teams.count()),
                        "teamAcronym": "T" + str(tournament.teams.count()),
                        "tournament": request.data["tournamentID"],
                        "teamJoiningMode": "public",
                        "rolesFilled": {
                            "Top": None,
                            "Jungle": None,
                            "Mid": None,
                            "Bot": None,
                            "Support": None,
                        },
                        "inviteCode": generateInviteCode(6),
                        "members": [],
                    },
                )
                for waitingSummoner in tournament.quickJoinQueue.all()[:4]:
                    joinTeamFunc(waitingSummoner.summonerID, teamID)
                joinTeamFunc(summoner.summonerID, teamID)
                return Response({"message": "Created Team", "id": teamID}, 200)
            else:
                tournament.quickJoinQueue.add(summoner)
                openPrivateTeams = (
                    tournament.teams.all()
                    .annotate(membersCount=Count("members"))
                    .filter(
                        Q(membersCount__lt=5) & Q(teamJoiningMode__exact="request-only")
                    )
                    .order_by("-membersCount")
                )
                for privateTeam in openPrivateTeams:
                    summoner.requestedTeams.add(privateTeam)
                    summoner.save()
                return Response({"message": "Sent Requests"}, 200)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def generateInviteCode(length):
    characters = string.ascii_uppercase + string.digits
    random_string = "".join(random.choice(characters) for _ in range(length))
    return random_string


@api_view(["POST"])
def startTournament(request):
    try:
        tournament = Tournament.objects.get(pk=request.data["tournamentID"])
        tournament.started = True
        teams = [
            {"id": team.id, "Name": team.teamName, "Score": 0, "Status": "Playing"}
            for team in list(tournament.teams.all())
            if not team.teamName in request.data["omittedTeams"]
        ]
        if len(teams) < 2:
            return Response(
                "Not enough teams to start!",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        random.shuffle(teams)
        gameNumber = 1
        bracket = []

        nearestPow2 = 2 ** int(math.log2(len(teams)))
        extraTeams = len(teams) - nearestPow2
        if extraTeams != 0:
            layerOne = []
            for i in range(0, extraTeams):
                layerOne.append(
                    {
                        "Game Number": gameNumber,
                        "Room Code": "AAAAAA",
                        "Next Game": math.ceil(gameNumber / 2) + extraTeams,
                        "Team 1": teams[2 * i],
                        "Team 2": teams[2 * i + 1],
                        "Status": "Playing",
                    }
                )
                gameNumber += 1
            bracket.append(layerOne)

        layerCount = int(nearestPow2 / 2)
        layerTwo = []
        for i in range(0, math.ceil(extraTeams / 2)):
            layerTwo.append(
                {
                    "Game Number": gameNumber,
                    "Room Code": "AAAAAA",
                    "Next Game": gameNumber + (layerCount - i - 1) + i // 2 + 1
                    if layerCount > 1
                    else None,
                    "Team 1": None,
                    "Team 2": None,
                    "Status": "Idle",
                }
            )
            gameNumber += 1
        if extraTeams % 2 == 1:
            layerTwo[-1]["Team 2"] = teams[2 * extraTeams]
        start = (2 * extraTeams) + (0 if extraTeams % 2 == 0 else 1)
        teamPos = 0
        for i in range(len(layerTwo), layerCount):
            layerTwo.append(
                {
                    "Game Number": gameNumber,
                    "Room Code": "AAAAAA",
                    "Next Game": gameNumber + (layerCount - i - 1) + i // 2 + 1
                    if layerCount > 1
                    else None,
                    "Team 1": teams[start + 2 * teamPos],
                    "Team 2": teams[start + (2 * teamPos + 1)],
                    "Status": "Playing",
                }
            )
            gameNumber += 1
            teamPos += 1
        bracket.append(layerTwo)

        while len(bracket[-1]) > 1:
            layerCount = int(layerCount / 2)
            currLayer = []
            nextGame = gameNumber + layerCount
            for i in range(0, layerCount):
                currLayer.append(
                    {
                        "Game Number": gameNumber,
                        "Room Code": "AAAAAA",
                        "Next Game": nextGame if layerCount > 1 else None,
                        "Team 1": None,
                        "Team 2": None,
                        "Status": "Idle",
                    }
                )
                gameNumber += 1
                if i % 2 == 1:
                    nextGame += 1
            bracket.append(currLayer)

        tournament.bracket = bracket
        tournament.save()

        return Response(200)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def updateBracketScore(request):
    try:
        tournament = Tournament.objects.get(pk=request.data["tournamentID"])
        for i in range(len(tournament.bracket) - 1, -1, -1):
            for j in range(0, len(tournament.bracket[i])):
                if (
                    tournament.bracket[i][j]["Team 1"]
                    and tournament.bracket[i][j]["Team 1"]["id"] == request.data["id"]
                ):
                    tournament.bracket[i][j]["Team 1"]["Score"] = request.data[
                        "newScore"
                    ]
                    tournament.save()
                    return Response(tournament.bracket, 200)
                if (
                    tournament.bracket[i][j]["Team 2"]
                    and tournament.bracket[i][j]["Team 2"]["id"] == request.data["id"]
                ):
                    tournament.bracket[i][j]["Team 2"]["Score"] = request.data[
                        "newScore"
                    ]
                    tournament.save()
                    return Response(tournament.bracket, 200)
        return Response("Team not found!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def declareRoundWinner(request):
    try:
        tournament = Tournament.objects.get(pk=request.data["tournamentID"])
        for i in range(len(tournament.bracket) - 1, -1, -1):
            for j in range(0, len(tournament.bracket[i])):
                if (
                    tournament.bracket[i][j]["Game Number"]
                    == request.data["nextGameNum"]
                ):
                    if not tournament.bracket[i][j]["Team 1"]:
                        tournament.bracket[i][j]["Team 1"] = {
                            "id": request.data["id"],
                            "Name": request.data["teamName"],
                            "Score": 0,
                            "Status": "Playing",
                        }
                    else:
                        tournament.bracket[i][j]["Team 2"] = {
                            "id": request.data["id"],
                            "Name": request.data["teamName"],
                            "Score": 0,
                            "Status": "Playing",
                        }
                    if (
                        tournament.bracket[i][j]["Team 1"]
                        and tournament.bracket[i][j]["Team 2"]
                    ):
                        tournament.bracket[i][j]["Status"] = "Playing"
                if (
                    tournament.bracket[i][j]["Game Number"]
                    == request.data["currGameNum"]
                ):
                    if (
                        tournament.bracket[i][j]["Team 1"]["Name"]
                        == request.data["teamName"]
                    ):
                        tournament.bracket[i][j]["Team 1"]["Status"] = "Win"
                        tournament.bracket[i][j]["Team 2"]["Status"] = "Loss"
                    else:
                        tournament.bracket[i][j]["Team 1"]["Status"] = "Loss"
                        tournament.bracket[i][j]["Team 2"]["Status"] = "Win"
                    tournament.bracket[i][j]["Status"] = "Ended"
        tournament.save()
        return Response(tournament.bracket, 200)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def endTournament(request):
    tournament = Tournament.objects.get(pk=request.data["tournamentID"])
    tournament.delete()
    return Response(200)


@api_view(["POST"])
def updateTournamentTeams(request):
    try:
        tournament = Tournament.objects.get(pk=request.data["tournamentID"])
        omitted = []
        for teamData in request.data["teamData"]:
            if tournament.teams.filter(
                Q(teamName=teamData[0]) | Q(teamAcronym=teamData[1])
            ).exists():
                omitted.append(teamData[0])
            else:
                newTeam = Team(
                    teamName=teamData[0],
                    teamAcronym=teamData[1],
                    tournament=tournament,
                    teamJoiningMode="public",
                    rolesFilled={
                        "Top": None,
                        "Jungle": None,
                        "Mid": None,
                        "Bot": None,
                        "Support": None,
                    },
                    inviteCode=generate_random_string(6),
                )
                newTeam.save()
        return Response(
            {
                "teams": [appendMembersCount(team) for team in tournament.teams.all()],
                "omitted": omitted,
            },
            200,
        )
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def generate_random_string(n):
    characters = string.ascii_uppercase + string.digits
    random_string = "".join(random.choice(characters) for _ in range(n))
    return random_string


@api_view(["POST"])
def updateTournamentData(request):
    try:
        tournament = Tournament.objects.get(pk=request.data["tournamentID"])
        tournament.startTime = request.data["startTime"]
        tournament.teamsCap = request.data["teamsCap"]
        tournament.prizePool = request.data["prizePool"]
        tournament.registrationFee = request.data["registrationFee"]
        tournament.liveLink = request.data["liveLink"]
        tournament.save()
        return Response(
            {
                "startTime": tournament.startTime,
                "teamsCap": tournament.teamsCap,
                "prizePool": tournament.prizePool,
                "registrationFee": tournament.registrationFee,
                "liveLink": tournament.liveLink,
            },
            200,
        )
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
