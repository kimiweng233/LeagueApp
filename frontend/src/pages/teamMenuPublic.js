import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { FaListUl, FaSort } from "react-icons/fa";

import services from "../services";

import LoginGuard from "../components/Utilities/loginGuard";
import MemberCardPublic from "../components/Teams Display/memberCardPublic";
import { compareRank } from "../utilities/rankConversions";
import LoadingAnimation from "../components/Utilities/loadingAnimation";

import "../assets/css/teamMenu.css";

function TeamMenuPublic(props) {
    const [searchParams] = useSearchParams();

    const {
        data: teamData,
        isLoading: isTeamDataLoading,
        fetchStatus: teamDataFetchStatus,
    } = useQuery({
        queryKey: ["team-public-data", searchParams.get("teamID")],
        queryFn: async () =>
            services.getTeamPublicData({
                id: searchParams.get("teamID"),
            }),
        retry: false,
    });

    const teamDataLoading = isTeamDataLoading && teamDataFetchStatus !== "idle";

    const [globalCollapseStatus, setGlobalCollapseStatus] = useState(false);
    const [numOfExpandedMemberPanels, setNumOfExpandedMemberPanels] =
        useState();
    const [membersSort, setMembersSort] = useState("time joined");
    const [teamMembers, setTeamMembers] = useState([]);

    const [changeSignal, setChangeSignal] = useState(false);

    useEffect(() => {
        if (!isTeamDataLoading) {
            setTeamMembers([...teamData["members"]]);
            setNumOfExpandedMemberPanels(teamData["members"].length);
        }
    }, [teamData, isTeamDataLoading, teamDataFetchStatus]);

    useEffect(() => {}, [numOfExpandedMemberPanels]);

    const changeMembersSort = () => {
        let sortedMembers = [...teamMembers];
        if (membersSort == "time joined") {
            setMembersSort("rank");
            sortedMembers.sort((memberA, memberB) => {
                const memberARank = memberA.tier + memberA.rank;
                const memberBRank = memberB.tier + memberB.rank;
                return compareRank(memberARank, memberBRank);
            });
        } else if (membersSort == "rank") {
            setMembersSort("winrate");
            sortedMembers.sort((memberA, memberB) => {
                return memberB.winrate - memberA.winrate;
            });
        } else if (membersSort == "winrate") {
            setMembersSort("time joined");
            sortedMembers = teamData.members;
        }
        setGlobalCollapseStatus(false);
        setNumOfExpandedMemberPanels(teamData.requests.length);
        setChangeSignal(!changeSignal);
        setTeamMembers(sortedMembers);
    };

    const changeGlobalCollapseStatus = () => {
        if (numOfExpandedMemberPanels < teamData.members.length) {
            setGlobalCollapseStatus(false);
            setNumOfExpandedMemberPanels(teamData.members.length);
        } else {
            setGlobalCollapseStatus(true);
            setNumOfExpandedMemberPanels(0);
        }
        setChangeSignal(!changeSignal);
    };

    return (
        <div className="teamMenuWrapper">
            <div className="tournamentFormTitleSectionWrapper">
                <div className="tournamentFormSectionTitleDividerBarsBlueLeft" />
                <h1 className="tournamentFormSectionTitleBlue">Team Menu</h1>
                <div className="tournamentFormSectionTitleDividerBarsBlueRight" />
            </div>
            <div className="teamMenu">
                {!teamDataLoading ? (
                    <div className="teamMenuComponent">
                        <div className="teamMenuTopSection">
                            <div className="teamTitleSection">
                                <div className="coupledElements">
                                    <h1 className="teamTitleFont teamName">
                                        {teamData?.teamName}
                                    </h1>
                                    <h1 className="teamTitleFont">
                                        ({teamData?.teamAcronym})
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="teamMemberCardsWrapper">
                            <div className="teamMemberCardSectionWrapper">
                                <h3 className="teamMemberCardSectionTitle">
                                    Team Members
                                </h3>
                                <div className="teamMemberCardsButtons">
                                    <div
                                        className="sortMembersWrapper"
                                        onClick={changeGlobalCollapseStatus}
                                    >
                                        <FaListUl className="massCollapseButton" />
                                        <h5 className="sortMembersText blueTextHighlights">
                                            {numOfExpandedMemberPanels <
                                            teamData?.members.length
                                                ? "expand all"
                                                : "collapse all"}
                                        </h5>
                                    </div>
                                    <div
                                        className="sortMembersWrapper"
                                        onClick={changeMembersSort}
                                    >
                                        <FaSort className="sortMemebersButton" />
                                        <h5 className="sortMembersText blueTextHighlights">
                                            {membersSort}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="teamMemberCards formInfoBackground">
                                {teamMembers.map((member, i) => {
                                    return (
                                        <MemberCardPublic
                                            key={i}
                                            {...member}
                                            globalCollapseStatus={
                                                globalCollapseStatus
                                            }
                                            numOfExpandedMemberPanels={
                                                numOfExpandedMemberPanels
                                            }
                                            setNumOfExpandedMemberPanels={
                                                setNumOfExpandedMemberPanels
                                            }
                                            teamData={teamData}
                                            changeSignal={changeSignal}
                                            roles={teamData?.rolesFilled}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <LoadingAnimation />
                )}
            </div>
        </div>
    );
}

export default LoginGuard(TeamMenuPublic);
