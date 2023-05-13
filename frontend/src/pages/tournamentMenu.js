import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import TournamentBracket from '../components/Tournaments Display/tournamentBracket'
import LoginGuard from '../components/loginGuard';

import services from '../services'

function TournamentMenu() {

    const [tournamentData, settournamentData] = useState({});
    const [searchParams] = useSearchParams();

    useEffect(() => {
        services.getTournamentData({"id": searchParams.get("tournamentID")}).then(response => {
            settournamentData(response.data["tournament"])
        })
    }, [searchParams])

    return (
        <div>
            <p>{tournamentData["tournamentName"]}</p>
            <TournamentBracket {...tournamentData}/>
        </div>
    );
}
  
export default LoginGuard(TournamentMenu);