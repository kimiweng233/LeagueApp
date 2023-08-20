import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { RxCross2 } from "react-icons/rx";

import LoadingScreen from "../Utilities/loadingScreen";

import services from "../../services";

import "../../assets/css/dashboard.css";

function EndTournamentCard(props) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setShowScreen = props.setShowScreen;

    const { mutate: endTournament, isLoading: endTournamentLoading } =
        useMutation({
            mutationFn: () =>
                services.endTournament({
                    tournamentID: searchParams.get("tournamentID"),
                }),
            onSuccess: () => {
                navigate("/dashboard");
            },
        });

    return (
        <div className="endTournamentCard">
            {endTournamentLoading && <LoadingScreen />}
            <RxCross2
                className="endTournamentCardExit"
                onClick={() => setShowScreen(false)}
            />
            <div className="endTournamentCardTextWrapper">
                <h2 className="endTournamentCardText">
                    Are you sure to end the tournament?
                </h2>
            </div>
            <div className="endTournamentCardButtonsRow">
                <button
                    className="endTournamentCardCancelButton"
                    onClick={() => setShowScreen(false)}
                >
                    Cancel
                </button>
                <button
                    className="endTournamentCardExitButton"
                    onClick={endTournament}
                >
                    End
                </button>
            </div>
        </div>
    );
}

export default EndTournamentCard;
