import React, { useState, useEffect } from "react";

import { BiExpandVertical } from "react-icons/bi";

import TopImage from "../../assets/Positions/Position_Challenger-Top.png";
import JungleImage from "../../assets/Positions/Position_Challenger-Jungle.png";
import MidImage from "../../assets/Positions/Position_Challenger-Mid.png";
import BotImage from "../../assets/Positions/Position_Challenger-Bot.png";
import SuppImage from "../../assets/Positions/Position_Challenger-Support.png";

import { getAverageRank } from "../../utilities/rankConversions";

import TeamMembersTable from "./teamMembersTable";

const TeamCard = React.forwardRef((ButtonsList, ref) => {
    function WrappedComponent(props) {
        const [avgTier, setAvgTier] = useState("");
        const [avgRank, setAvgRank] = useState("");
        const [showMembers, setShowMembers] = useState(false);

        useEffect(() => {
            let avg = getAverageRank(
                props.members
                    .filter((member) => member["tier"] != null)
                    .map((member) => {
                        return member["tier"].concat(member["rank"]);
                    })
            );
            setAvgTier(avg["tier"]);
            setAvgRank(avg["rank"]);
        }, []);

        return (
            <div className="teamCardWrapper" ref={ref}>
                <div className="teamStatsWrapper">
                    <div className="teamStats">
                        <div className="cardTitleWrapper">
                            <h1 className="cardTitle">
                                {props.teamName} ({props.teamAcronym})
                            </h1>
                        </div>
                        <div className="teamDetailsWrapper">
                            <div className="teamInfoWrapper">
                                <h4 className="cardTitle">
                                    {props.members.length} / 5 Joined
                                </h4>
                                <div className="roleIconsWrapper">
                                    <h4 className="cardTitle">Vacant Roles:</h4>
                                    <div className="roleIcons">
                                        {props.rolesFilled["Top"] == null && (
                                            <img
                                                className="positionIcon"
                                                src={TopImage}
                                            />
                                        )}
                                        {props.rolesFilled["Jungle"] ==
                                            null && (
                                            <img
                                                className="positionIcon"
                                                src={JungleImage}
                                            />
                                        )}
                                        {props.rolesFilled["Mid"] == null && (
                                            <img
                                                className="positionIcon"
                                                src={MidImage}
                                            />
                                        )}
                                        {props.rolesFilled["Bot"] == null && (
                                            <img
                                                className="positionIcon"
                                                src={BotImage}
                                            />
                                        )}
                                        {props.rolesFilled["Support"] ==
                                            null && (
                                            <img
                                                className="positionIcon"
                                                src={SuppImage}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="teamAvgRankWrapper">
                                    <h4 className="cardTitle">Average Rank:</h4>
                                    <h4 className="avgRankText">
                                        {avgTier == "MASTER" ||
                                        avgTier == "GRANDMASTER" ||
                                        avgTier == "CHALLENGER"
                                            ? `${avgTier}`
                                            : `${avgTier} ${avgRank}`}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="teamButtons">
                        {ButtonsList.map((button, i) => {
                            return (
                                <button.button
                                    key={i}
                                    {...button.props(props)}
                                />
                            );
                        })}
                    </div>
                </div>
                <div
                    className="memberBoardWrapper"
                    onClick={() => {
                        setShowMembers(!showMembers);
                    }}
                >
                    <h4 className="blackText">Team Members</h4>
                    <BiExpandVertical className="expandArrowIcon" />
                </div>
                {showMembers && <TeamMembersTable {...props} />}
            </div>
        );
    }
    return WrappedComponent;
});

export default TeamCard;
