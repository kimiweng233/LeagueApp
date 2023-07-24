import { useState, useEffect } from "react";

import {
    rankImgSwitch,
    positionImgSwitch,
} from "../../utilities/imageSwitches";
import { getSummonerIcon } from "../../utilities/dataDragonCalls";

const TeamMembersTableRow = (props) => {
    const { member, rolesFilled } = props;

    const [profileIconSrc, setProfileIconSrc] = useState("");

    useEffect(() => {
        getSummonerIcon(member.profilePicture).then((response) => {
            setProfileIconSrc(response);
        });
    }, []);

    const memberPositionEmblem = (member, i) => {
        const filteredMemberRole = Object.keys(rolesFilled).filter(
            (role) => rolesFilled[role] == member.summonerID
        );
        if (filteredMemberRole.length > 0) {
            return (
                <div className="positionEmblemWrapper">
                    <img
                        key={i}
                        className="positionEmblem"
                        src={positionImgSwitch(filteredMemberRole[0])}
                    />
                </div>
            );
        } else {
            return <h4>Not Selected</h4>;
        }
    };

    return (
        <tr>
            <td className="tableCellWrapper">
                <div className="tableCell">
                    <img className="memberPfp" src={profileIconSrc} />
                    <h4 className="noWrapText">
                        <a
                            href={`https://www.op.gg/summoners/na/${member.summonerID}`}
                            target="_blank"
                        >
                            {member.summonerID}
                        </a>
                    </h4>
                </div>
            </td>
            <td className="tableCellWrapper">
                <div className="tableCell">{memberPositionEmblem(member)}</div>
            </td>
            <td className="tableCellWrapper">
                {member.tier ? (
                    <div className="tableCell">
                        <img
                            className="rankEmblemtableColumn"
                            src={rankImgSwitch(member.tier)}
                        />
                        <h6 className="ranktableColumn">({member.rank})</h6>
                    </div>
                ) : (
                    <h4>NA</h4>
                )}
            </td>
            <td className="tableCellWrapper">
                <div className="tableCell">
                    <h4
                        className={` ${
                            member.winrate < 50
                                ? "winrateHighlightRed"
                                : member.winrate >= 60
                                ? "winrateHighlightGreen"
                                : "winrateHighlightYellow"
                        }`}
                    >
                        {member.winrate}%
                    </h4>
                    <p className="gameCountText">{member.gameCount} games</p>
                </div>
            </td>
        </tr>
    );
};

export default TeamMembersTableRow;
