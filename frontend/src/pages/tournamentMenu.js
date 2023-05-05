import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import TournamentBracket from "../components/tournamentBracket";

import services from '../services'

function TournamentMenu() {

    const [tournamentData, settournamentData] = useState({});
    const [searchParams] = useSearchParams();

    useEffect(() => {
        services.getTournamentData({"id": searchParams.get("tournamentID")}).then(response => {
            console.log(response.data);
            settournamentData(response.data["tournament"])
        })
    }, [])

    return (
        <div>
            <p>{tournamentData["tournamentName"]}</p>
            <TournamentBracket {...tournamentData}/>
        </div>
    );
}
  
export default TournamentMenu;