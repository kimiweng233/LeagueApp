import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import services from '../services'

import LoginGuard from '../components/loginGuard';
import MemberCard from "../components/Teams Display/memberCard";
import RequestMemberCard from "../components/Teams Display/requestMemberCard";
import RoleButton from "../components/Teams Display/roleButton";

function TeamMenu(prop) {

    const [teamName, setTeamName] = useState("");
    const [teamAcronym, setTeamAcronym] = useState("");
    const [teamJoiningMode, setTeamJoiningMode] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamRoles, setTeamRoles] = useState({});
    const [teamRequests, setTeamRequests] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        services.getTeamData({"id": searchParams.get("teamID")}).then(response => {
            console.log(response.data);
            setTeamName(response.data["team"]["teamName"]);
            setTeamAcronym(response.data["team"]["teamAcronym"]);
            setTeamJoiningMode(response.data["team"]["teamJoiningMode"]);
            setTeamMembers(response.data["team"]["members"]);
            setTeamRoles(response.data["team"]["rolesFilled"]);
            setTeamRequests(response.data["team"]["requests"]);
        })
    }, [searchParams])

    return (
        <div>
        <p>{teamName}</p>
        <p>{teamAcronym}</p>
        <p>{teamJoiningMode}</p>
        {teamMembers.map( (member, i) => {
            return <MemberCard key={i} {...member} roles={teamRoles} />
        })}
        {Object.entries(teamRoles).map(([key, value], i) => (
            <RoleButton key={i} role={key} summonerID={value} />
        ))}
        <h1>Requests</h1>
        {teamRequests.map( (member, i) => {
            return <RequestMemberCard key={i} {...member}/>
        })}
        </div>
    );
}
  
export default LoginGuard(TeamMenu);