import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { FaSort } from "react-icons/fa";

import services from "../services";

import OpenTournament from "../components/Tournaments Display/openTournament";
import OngoingTournament from "../components/Tournaments Display/ongoingTournamentListing";
import LoginGuard from "../components/Utilities/loginGuard";

import "../assets/css/tournamentsList.css";

import LoadingAnimation from "../components/Utilities/loadingAnimation";
import ErrorText from "../components/Utilities/errorText";

function TournamentsList() {
    const [tournamentSort, setTournamentSort] = useState("startDate");
    const [joinedTournamentFilter, setJoinedTournamentFilter] = useState(true);

    const {
        data: tournamentsList,
        isLoading: isTournamentsLoading,
        fetchStatus: tournamentsFetchStatus,
        isError: tournamensListError,
    } = useQuery({
        queryKey: ["tournaments-list"],
        queryFn: async () => services.getTournamentsList(),
        retry: false,
    });

    const tournamentsLoading =
        isTournamentsLoading && tournamentsFetchStatus !== "idle";

    const {
        data: joinedTournamentsList,
        isLoading: isJoinedTournamentsLoading,
        fetchStatus: JoinedTournamentsFetchStatus,
        isError: joinedTournamentsListError,
    } = useQuery({
        queryKey: ["joined-tournaments"],
        queryFn: async () =>
            services.getTournamentsJoined({
                summonerID: localStorage.getItem("summonerID"),
            }),
        retry: false,
    });

    const joinedTournamentsLoading =
        isJoinedTournamentsLoading && JoinedTournamentsFetchStatus !== "idle";

    const soonestSort = (tournament1, tournament2) => {
        const date1 = new Date(tournament1["startTime"]).getTime();
        const date2 = new Date(tournament2["startTime"]).getTime();
        return date1 < date2 ? -1 : 1;
    };

    const mostRecentSort = (tournament1, tournament2) => {
        return tournament1.id > tournament2.id ? -1 : 1;
    };

    const highestPrizeSort = (tournament1, tournament2) => {
        return tournament1.prizePool > tournament2.prizePool ? -1 : 1;
    };

    const lowestRegistrationFeeSort = (tournament1, tournament2) => {
        return tournament1.registrationFee < tournament2.registrationFee
            ? -1
            : 1;
    };

    const switchTournamentSort = () => {
        if (tournamentSort == "startDate") {
            setTournamentSort("postedDate");
        } else if (tournamentSort == "postedDate") {
            setTournamentSort("prizePool");
        } else if (tournamentSort == "prizePool") {
            setTournamentSort("registrationFee");
        } else if (tournamentSort == "registrationFee") {
            setTournamentSort("startDate");
        }
    };

    const sortFunctions = {
        startDate: { displayText: "By Starting Date", function: soonestSort },
        postedDate: { displayText: "By Date Posted", function: mostRecentSort },
        prizePool: {
            displayText: "By Prize Pool Size",
            function: highestPrizeSort,
        },
        registrationFee: {
            displayText: "By Registration Fee Cost",
            function: lowestRegistrationFeeSort,
        },
    };

    if (tournamensListError || joinedTournamentsListError) {
        return (
            <ErrorText>
                Error loading tournaments, please try refreshing!
            </ErrorText>
        );
    }

    return (
        <div className="tournamentsListWrapper">
            <div className="tournamentFormTitleSectionWrapper">
                <div className="tournamentFormSectionTitleDividerBarsBlueLeft" />
                <h1 className="tournamentFormSectionTitleBlue">
                    Ongoing Tournaments
                </h1>
                <div className="tournamentFormSectionTitleDividerBarsBlueRight" />
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
            <div className="tournamentFormTitleSectionWrapper">
                <div className="tournamentFormSectionTitleDividerBarsBlueLeft" />
                <h1 className="tournamentFormSectionTitleBlue">
                    Open Tournaments
                </h1>
                <div className="tournamentFormSectionTitleDividerBarsBlueRight" />
            </div>
            <div className="FilterWrapper">
                <div className="tournamentsFilterWrapper">
                    <div className="tournamentsSortWrapper">
                        <p className="tournamentSortFont blueTextHalo">
                            Show Joined Tournaments
                        </p>
                        <label className="tournamentSortToggleWrapper">
                            <input
                                className="tournamentSortToggle"
                                type="checkbox"
                                onClick={() =>
                                    setJoinedTournamentFilter(
                                        !joinedTournamentFilter
                                    )
                                }
                            />
                            <span className="tournamentSortToggleSlider"></span>
                        </label>
                    </div>
                    <div
                        className="tournamentsSortWrapper"
                        onClick={switchTournamentSort}
                    >
                        <p className="tournamentSortFont blueTextHalo">
                            {sortFunctions[tournamentSort]["displayText"]}
                        </p>
                        <FaSort className="tournamentSortIcon" />
                    </div>
                </div>
            </div>
            <div className="tournamentCardsWrapper">
                {tournamentsLoading || joinedTournamentsLoading ? (
                    <LoadingAnimation />
                ) : (
                    <div>
                        {tournamentsList["open"].filter((tournament) => {
                            return joinedTournamentFilter
                                ? !joinedTournamentsList.includes(tournament.id)
                                : true;
                        }).length > 0 ? (
                            tournamentsList["open"]
                                .filter((tournament) => {
                                    return joinedTournamentFilter
                                        ? !joinedTournamentsList.includes(
                                              tournament.id
                                          )
                                        : true;
                                })
                                .sort(sortFunctions[tournamentSort]["function"])
                                .map((tournament, i) => {
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
