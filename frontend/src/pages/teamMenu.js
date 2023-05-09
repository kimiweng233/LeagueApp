import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import services from '../services'
import LoginGuard from '../components/loginGuard';

function TeamMenu(prop) {

    const [teamName, setTeamName] = useState("");
    const [teamAcronym, setTeamAcronym] = useState("");
    const [teamJoiningMode, setTeamJoiningMode] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        services.getTeamData({"id": searchParams.get("teamID")}).then(response => {
            setTeamName(response.data["team"]["teamName"]);
            setTeamAcronym(response.data["team"]["teamAcronym"]);
            setTeamJoiningMode(response.data["team"]["teamJoiningMode"]);
            // setTeamsList(response.data["teams"]);
        })
    }, [])

    return (
        <div>
        <p>{teamName}</p>
        <p>{teamAcronym}</p>
        <p>{teamJoiningMode}</p>
        </div>
    );
}
  
export default LoginGuard(TeamMenu);