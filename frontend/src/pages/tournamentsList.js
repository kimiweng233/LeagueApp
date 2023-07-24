import { useQuery } from "@tanstack/react-query";

import services from "../services";

import OpenTournament from "../components/Tournaments Display/openTournament";
import OngoingTournament from "../components/Tournaments Display/ongoingTournamentListing";
import LoginGuard from "../components/Utilities/loginGuard";

import { GiCrossedSwords, GiShieldEchoes } from "react-icons/gi";

import "../assets/css/tournamentsList.css";

import LoadingAnimation from "../components/Utilities/loadingAnimation";

function TournamentsList() {
    const {
        data: tournamentsList,
        isLoading: isTournamentsLoading,
        fetchStatus: tournamentsFetchStatus,
    } = useQuery({
        queryKey: ["tournaments-list"],
        queryFn: async () => services.getTournamentsList(),
        retry: false,
    });

    const {
        data: joinedTournamentsList,
        isLoading: isJoinedTournamentsLoading,
        fetchStatus: JoinedTournamentsFetchStatus,
    } = useQuery({
        queryKey: ["joined-tournaments"],
        queryFn: async () =>
            services.getTournamentsJoined({
                summonerID: localStorage.getItem("summonerID"),
            }),
        retry: false,
    });

    const tournamentsLoading =
        isTournamentsLoading && tournamentsFetchStatus !== "idle";
    const joinedTournamentsLoading =
        isJoinedTournamentsLoading && JoinedTournamentsFetchStatus !== "idle";

    return (
        <div className="tournamentsListWrapper">
            <h1 className="tournamentSectionTitle tournamentSectionTitleRed">
                Ongoing Tournaments
            </h1>
            <div className="tournamentSectionTitleDivider">
                <div className="tournamentSectionTitleDividerBarsRed" />
                <GiCrossedSwords className="tournamentSectionWingSymbol" />
                <div className="tournamentSectionTitleDividerBarsRed" />
            </div>
            <div className="tournamentCardsWrapper">
                {tournamentsLoading || joinedTournamentsLoading ? (
                    <LoadingAnimation />
                ) : (
                    <div>
                        {tournamentsList["ongoing"].length > 0 ? (
                            tournamentsList["ongoing"].map((tournament, i) => {
                                return (
                                    <OngoingTournament
                                        key={i}
                                        {...tournament}
                                        tournamentStatus="ongoing"
                                    />
                                );
                            })
                        ) : (
                            <div className="noMatchesSignWrapper">
                                <h1 className="NoMatchesSign">
                                    No Matches Found QAQ
                                </h1>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <h1 className="tournamentSectionTitle tournamentSectionTitleBlue">
                Open Tournaments
            </h1>
            <div className="tournamentSectionTitleDivider">
                <div className="tournamentSectionTitleDividerBarsBlue" />
                <GiShieldEchoes className="tournamentSectionWingSymbol" />
                <div className="tournamentSectionTitleDividerBarsBlue" />
            </div>
            <div className="tournamentCardsWrapper">
                {tournamentsLoading || joinedTournamentsLoading ? (
                    <LoadingAnimation />
                ) : (
                    <div>
                        {tournamentsList["open"].length > 0 ? (
                            tournamentsList["open"].map((tournament, i) => {
                                return (
                                    <OpenTournament
                                        key={i}
                                        {...tournament}
                                        alreadyJoined={joinedTournamentsList.includes(
                                            tournament.id
                                        )}
                                        tournamentStatus="open"
                                    />
                                );
                            })
                        ) : (
                            <div className="noMatchesSignWrapper">
                                <h1 className="NoMatchesSign">
                                    No Matches Found QAQ
                                </h1>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginGuard(TournamentsList);
