import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import LoadingAnimation from "../components/Utilities/loadingAnimation";

import services from "../services";

import TournamentAdminBracket from "../components/Tournaments Display/tournamentAdminBracket";
import EndTournamentCard from "../components/Tournaments Display/endTournamentCard";

import "../assets/css/dashboard.css";

function TournamentDashboard() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const [showScreen, setShowScreen] = useState(false);
    const [bracketWidth, setBracketWidth] = useState(0);
    const [bracketHeight, setBracketHeight] = useState(0);

    const {
        data: tournamentData,
        isLoading: isTournamentDataLoading,
        fetchStatus: tournamentDataFetchStatus,
    } = useQuery({
        queryKey: ["tournament", searchParams.get("tournamentID")],
        queryFn: async () =>
            services.getTournamentData({
                tournamentID: searchParams.get("tournamentID"),
                summonerID: localStorage.getItem("summonerID"),
            }),
        retry: false,
    });

    const tournamentDataLoading =
        isTournamentDataLoading && tournamentDataFetchStatus !== "idle";

    const { mutate: advanceRound } = useMutation({
        mutationFn: (param) =>
            services.declareRoundWinner({
                tournamentID: searchParams.get("tournamentID"),
                currGameNum: param.currGameNum_in,
                nextGameNum: param.nextGameNum_in,
                teamName: param.teamName_in,
                id: param.id_in,
            }),
        onSuccess: (newBracket) => {
            queryClient.setQueryData(
                ["tournament", searchParams.get("tournamentID")],
                {
                    ...tournamentData,
                    bracket: newBracket,
                }
            );
        },
    });

    if (tournamentDataLoading) {
        return (
            <div>
                <LoadingAnimation />
            </div>
        );
    }

    return (
        <div className="tournamentMenuWrapper">
            {showScreen && (
                <div className="loadingScreen">
                    <EndTournamentCard setShowScreen={setShowScreen} />
                </div>
            )}
            <div className="tournamentFormTitleSectionWrapper">
                <div className="tournamentFormSectionTitleDividerBarsBlueLeft" />
                <h1 className="tournamentFormSectionTitleBlue">
                    {tournamentData.tournamentName}
                </h1>
                <div className="tournamentFormSectionTitleDividerBarsBlueRight" />
            </div>
            <div className="tournamentMenu">
                <div
                    className={`tournamentBracketViewPort ${
                        bracketWidth <= window.innerWidth * 0.7 &&
                        bracketHeight <= window.innerHeight * 0.8 &&
                        "flexBoxColumn"
                    }`}
                >
                    <TournamentAdminBracket
                        bracket={tournamentData.bracket}
                        startTime={tournamentData.startTime}
                        setBracketWidth={setBracketWidth}
                        setBracketHeight={setBracketHeight}
                        advanceRound={advanceRound}
                    />
                </div>
                <button
                    className="endTournamentButton"
                    onClick={() => {
                        setShowScreen(true);
                    }}
                >
                    End Tournament
                </button>
            </div>
        </div>
    );
}

export default TournamentDashboard;
