import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import LoadingScreen from "../components/Utilities/loadingScreen";
import LoadingAnimation from "../components/Utilities/loadingAnimation";
import LoginGuard from "../components/Utilities/loginGuard";
import CustomAlert from "../components/Utilities/customAlert";

import services from "../services";

function TeamInvite() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const {
        data: tournamentJoinStatus,
        isLoading: isTournamentJoinStatusLoading,
        fetchStatus: tournamentJoinStatusFetchStatus,
        isError: tournamentJoinStatusError,
    } = useQuery({
        queryKey: ["tournament-join-status", searchParams.get("tournamentID")],
        queryFn: async () =>
            services.checkIfJoinedTournament({
                summonerID: localStorage.getItem("summonerID"),
                tournamentID: searchParams.get("tournamentID"),
            }),
        retry: false,
    });

    const tournamentJoinStatusLoading =
        isTournamentJoinStatusLoading &&
        tournamentJoinStatusFetchStatus !== "idle";

    const {
        data: teamData,
        isLoading: isTeamDataLoading,
        fetchStatus: teamDataFetchStatus,
        isError: isTeamDataLoadingError,
    } = useQuery({
        queryKey: ["team-data", searchParams.get("teamID")],
        queryFn: async () =>
            services.getTeamData({
                id: searchParams.get("teamID"),
            }),
        retry: false,
    });

    const teamDataLoading = isTeamDataLoading && teamDataFetchStatus !== "idle";

    const { mutate: approveJoin, isLoading: approveJoinLoading } = useMutation({
        mutationFn: () =>
            services.joinTeam({
                summonerID: localStorage.getItem("summonerID"),
                teamID: searchParams.get("teamID"),
            }),
        onSuccess: () => {
            navigate(`/team?teamID=${searchParams.get("teamID")}`);
        },
        onError: (error) => {
            setAlertMessage(error.response.data);
            setShowAlert(true);
        },
    });

    if (tournamentJoinStatusError || isTeamDataLoadingError) {
        return (
            <div className="formWrapper">
                <div className="loginForm">
                    {!tournamentJoinStatusLoading && !teamDataLoading ? (
                        <div className="loginInputWrapper">
                            <h2 className="formInputFieldLabel textNoButtomMargin bracketDescriptionTitle whitespaceWrap">
                                Error loading team info, please make sure the
                                url is still valid
                            </h2>
                        </div>
                    ) : (
                        <LoadingAnimation />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="formWrapper">
            {approveJoinLoading && <LoadingScreen />}
            {showAlert && (
                <CustomAlert
                    alertType="danger"
                    setShowAlert={() => setShowAlert(false)}
                >
                    {alertMessage}
                </CustomAlert>
            )}
            <div className="loginForm">
                {!tournamentJoinStatusLoading && !teamDataLoading ? (
                    <div className="loginInputWrapper">
                        <h2 className="formInputFieldLabel textNoButtomMargin bracketDescriptionTitle">
                            {`Join ${teamData?.teamName} (${teamData?.teamAcronym})?`}
                        </h2>
                        <button
                            type="submit"
                            disabled={
                                !(
                                    !tournamentJoinStatus &&
                                    teamData.members.length < 5
                                )
                            }
                            onClick={approveJoin}
                            className={`topMargin linkAccountButtonBase ${
                                !tournamentJoinStatus &&
                                teamData.members.length < 5
                                    ? "linkAccountButton"
                                    : "tournamentButtonDisabledHighlight"
                            } blueTextHalo`}
                        >
                            {`${
                                tournamentJoinStatus
                                    ? "Already Joined a Team"
                                    : teamData.members.length >= 5
                                    ? "Team Capacity has been Reached"
                                    : "Join Team"
                            }`}
                        </button>
                    </div>
                ) : (
                    <LoadingAnimation />
                )}
            </div>
        </div>
    );
}

export default LoginGuard(TeamInvite);
