import React from "react";
import { useQuery } from "@tanstack/react-query";

import LoadingAnimation from "../components/Utilities/loadingAnimation";
import NoDataFallback from "../components/Utilities/noDataFallback";

import services from "../services";

import "../assets/css/dashboard.css";

const Dashboard = () => {
    const {
        data: tournamentsList,
        isLoading: isTournamentsLoading,
        fetchStatus: tournamentsFetchStatus,
        isError: tournamentsListError,
    } = useQuery({
        queryKey: ["tournaments-list"],
        queryFn: async () => services.getTournamentsList(),
        retry: false,
    });

    const tournamentsLoading =
        isTournamentsLoading && tournamentsFetchStatus !== "idle";

    if (tournamentsListError) {
        return (
            <NoDataFallback>
                Error fetching tournaments data, please try refreshing!
            </NoDataFallback>
        );
    }

    if (tournamentsLoading) {
        return <LoadingAnimation />;
    } else {
        return (
            <div className="dashboardWrapper">
                <div className="dashboardColumn">
                    <h1 className="dashboardHighlight">Open</h1>
                    {tournamentsList &&
                        tournamentsList["open"].map((tournament, i) => (
                            <a
                                className="dashboardLink"
                                key={i}
                                href={`/tournamentPlanning?tournamentID=${tournament.id}`}
                            >
                                {tournament.tournamentName}
                            </a>
                        ))}
                </div>
                <div className="dashboardColumn">
                    <h1 className="dashboardHighlight">Ongoing</h1>
                    {tournamentsList &&
                        tournamentsList["ongoing"].map((tournament, i) => (
                            <a
                                className="dashboardLink"
                                key={i}
                                href={`/tournamentDashboard?tournamentID=${tournament.id}`}
                            >
                                {tournament.tournamentName}
                            </a>
                        ))}
                </div>
            </div>
        );
    }
};
export default Dashboard;
