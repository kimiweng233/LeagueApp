import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import TournamentBracket from "../components/Tournaments Display/tournamentBracket";
import TournamentDescription from "../components/Tournaments Display/tournamentDescription";
import LoginGuard from "../components/Utilities/loginGuard";
import LoadingAnimation from "../components/Utilities/loadingAnimation";
import NoDataFallback from "../components/Utilities/noDataFallback";

import services from "../services";

import "../assets/css/tournamentBracket.css";

function TournamentMenu() {
    const [bracketWidth, setBracketWidth] = useState(0);
    const [bracketHeight, setBracketHeight] = useState(0);
    const [searchParams] = useSearchParams();

    const {
        data: tournamentData,
        isLoading: isTournamentDataLoading,
        fetchStatus: tournamentDataFetchStatus,
        isError: tournamentDataError,
    } = useQuery({
        queryKey: ["tournament", searchParams.get("tournamentID")],
        queryFn: async () =>
            services.getTournamentData({
                tournamentID: searchParams.get("tournamentID"),
                summonerID: localStorage.getItem("summonerID"),
            }),
        retry: false,
        refetchInterval: 15000,
    });
    const tournamentDataLoading =
        isTournamentDataLoading && tournamentDataFetchStatus !== "idle";

    if (tournamentDataError) {
        return (
            <NoDataFallback>
                This tournament does not exist or has ended
            </NoDataFallback>
        );
    }

    return (
        <div>
            {tournamentDataLoading ? (
                <LoadingAnimation />
            ) : (
                <div className="tournamentMenuWrapper">
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
                            <TournamentBracket
                                bracket={tournamentData.bracket}
                                summonerTeam={tournamentData.summonerTeam}
                                startTime={tournamentData.startTime}
                                setBracketWidth={setBracketWidth}
                                setBracketHeight={setBracketHeight}
                            />
                        </div>
                        <TournamentDescription
                            tournamentData={tournamentData}
                            summonerTeam={tournamentData.summonerTeam}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginGuard(TournamentMenu);
