import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { AiOutlineStop } from "react-icons/ai";

import RoleButton from "../Teams Display/roleButton";
import LoadingAnimation from "../Utilities/loadingAnimation";
import { rankImgSwitch, masteryImgSwitch } from "../../utilities/imageSwitches";
import {
    getSummonerIcon,
    getChampionIcon,
} from "../../utilities/dataDragonCalls";

function MemberCardPublic(props) {
    const [hoveringUserPositionEmblem, setHoveringUserPositionEmblem] =
        useState(false);
    const [hideMemberDetails, setHideMemberDetails] = useState(false);
    const {
        profilePicture,
        topMasteries,
        globalCollapseStatus,
        summonerID,
        roles,
        numOfExpandedMemberPanels,
        setNumOfExpandedMemberPanels,
        winrate,
        tier,
        rank,
        gameCount,
        changeSignal,
        teamData,
    } = props;

    const {
        data: profileIconSrc,
        isLoading: isProfileIconSrcLoading,
        fetchStatus: profileIconSrcFetchStatus,
    } = useQuery({
        queryKey: ["profile-img", summonerID],
        queryFn: async () => getSummonerIcon(profilePicture),
        retry: false,
    });

    const profileIconSrcLoading =
        isProfileIconSrcLoading && profileIconSrcFetchStatus !== "idle";

    const {
        data: championIconSrc,
        isLoading: isChampionIconSrcLoading,
        fetchStatus: championIconSrcFetchStatus,
    } = useQuery({
        queryKey: ["champion-icons", summonerID],
        queryFn: async () => getChampionIcon(topMasteries["topMasteries"]),
        retry: false,
    });

    const championIconSrcLoading =
        isChampionIconSrcLoading && championIconSrcFetchStatus !== "idle";

    useEffect(() => {
        setHideMemberDetails(globalCollapseStatus);
    }, [globalCollapseStatus, changeSignal]);

    const openCloseMemberDetails = () => {
        if (hideMemberDetails) {
            setNumOfExpandedMemberPanels(numOfExpandedMemberPanels + 1);
        } else {
            setNumOfExpandedMemberPanels(numOfExpandedMemberPanels - 1);
        }
        setHideMemberDetails(!hideMemberDetails);
    };

    return (
        <div>
            {profileIconSrcLoading || championIconSrcLoading ? (
                <LoadingAnimation />
            ) : (
                <div
                    className={`teamMemberCard`}
                    onClick={openCloseMemberDetails}
                >
                    <div className="teamMemberCardContentWrapper blueHighlight">
                        <div className={`teamMemberCardContent`}>
                            <div className="memberCardPfpWrapper">
                                <img
                                    className="memberCardPfp blueHalo"
                                    src={profileIconSrc}
                                />
                                <h4 className="memberCardSummonerID noWrapText blueTextHalo">
                                    <a
                                        href={`https://www.op.gg/summoners/na/${summonerID}`}
                                        target="_blank"
                                    >
                                        {summonerID}
                                    </a>
                                </h4>
                            </div>
                        </div>
                        <div className="memberCardDivider blueHalo" />
                    </div>
                    {!hideMemberDetails && (
                        <div className={`teamMemberCardDetails`}>
                            <div className="teamMemberCardDetailsLeft">
                                <img
                                    className="memberDetailRankImg"
                                    src={rankImgSwitch(tier)}
                                />
                                <h5 className="blueTextHighlights">
                                    {tier} {rank}
                                </h5>
                                <h5 className="blueTextHighlights">
                                    {winrate}% ({gameCount} Games)
                                </h5>
                            </div>
                            <div className="teamMemberCardDetailsRightWrapper">
                                {topMasteries["topMasteries"].map(
                                    (championData, i) => (
                                        <div
                                            key={i}
                                            className="teamMemberCardChampionMasteryWrapper"
                                        >
                                            <img
                                                className="teamMemberCardChampionIcon blueHalo"
                                                src={championIconSrc[i]}
                                            />
                                            <img
                                                className="teamMemberCardChampionMasteryLevel"
                                                src={masteryImgSwitch(
                                                    championData["masteryLevel"]
                                                )}
                                            />
                                            <p className="blueTextHighlights">
                                                {championData["masteryPoints"]}{" "}
                                                pts
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default MemberCardPublic;
