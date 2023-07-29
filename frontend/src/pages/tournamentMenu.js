import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import TournamentBracket from "../components/Tournaments Display/tournamentBracket";
import LoginGuard from "../components/Utilities/loginGuard";
import LoadingAnimation from "../components/Utilities/loadingAnimation";

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
    } = useQuery({
        queryKey: ["tournament", searchParams.get("tournamentID")],
        queryFn: async () =>
            services.getTournamentData({
                tournamentID: searchParams.get("tournamentID"),
            }),
        retry: false,
    });
    const tournamentDataLoading =
        isTournamentDataLoading && tournamentDataFetchStatus !== "idle";

    // console.log(tournamentData);

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
                    <button
                        onClick={() =>
                            services.createBracket({
                                tournamentID: tournamentData.id,
                            })
                        }
                    >
                        meow lu
                    </button>
                    <div
                        className={`tournamentBracketViewPort ${
                            bracketWidth <= window.innerWidth * 0.7 &&
                            bracketHeight <= window.innerHeight * 0.8 &&
                            "flexBoxColumn"
                        }`}
                    >
                        <TournamentBracket
                            bracket={tournamentData.bracket}
                            setBracketWidth={setBracketWidth}
                            setBracketHeight={setBracketHeight}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginGuard(TournamentMenu);
