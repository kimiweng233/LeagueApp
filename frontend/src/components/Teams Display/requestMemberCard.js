import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import LoadingScreen from "../Utilities/loadingScreen";
import LoadingAnimation from "../Utilities/loadingAnimation";
import { rankImgSwitch, masteryImgSwitch } from "../../utilities/imageSwitches";
import {
    getSummonerIcon,
    getChampionIcon,
} from "../../utilities/dataDragonCalls";

import services from "../../services";

function RequestMemberCard(props) {
    const [hideMemberDetails, setHideMemberDetails] = useState(false);
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const {
        id,
        profilePicture,
        topMasteries,
        summonerID,
        winrate,
        tier,
        rank,
        gameCount,
        numOfExpandedMemberPanels,
        setNumOfExpandedMemberPanels,
        globalCollapseStatus,
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

    const { mutate: approveJoin, isLoading: approveJoinLoading } = useMutation({
        mutationFn: () =>
            services.joinTeam({
                summonerID: summonerID,
                teamID: searchParams.get("teamID"),
            }),
        onSuccess: () => {
            queryClient.setQueryData(
                ["team-data", searchParams.get("teamID")],
                {
                    ...teamData,
                    members: [
                        ...teamData.members,
                        {
                            id: id,
                            summonerID: summonerID,
                            profilePicture: profilePicture,
                            rank: rank,
                            tier: tier,
                            topMasteries: topMasteries,
                            winrate: winrate,
                            gameCount: gameCount,
                        },
                    ],
                    requests: teamData.requests.filter((member) => {
                        return member.summonerID != summonerID;
                    }),
                }
            );
        },
    });

    const { mutate: rejectJoin, isLoading: rejectJoinLoading } = useMutation({
        mutationFn: () =>
            services.rejectJoinRequest({
                summonerID: summonerID,
                teamID: searchParams.get("teamID"),
            }),
        onSuccess: () => {
            queryClient.setQueryData(
                ["team-data", searchParams.get("teamID")],
                {
                    ...teamData,
                    requests: teamData.requests.filter((member) => {
                        return member.summonerID != summonerID;
                    }),
                }
            );
        },
    });

    return (
        <div>
            {(approveJoinLoading || rejectJoinLoading) && <LoadingScreen />}
            {profileIconSrcLoading || championIconSrcLoading ? (
                <LoadingAnimation />
            ) : (
                <div
                    className={`teamMemberCard`}
                    onClick={openCloseMemberDetails}
                >
                    <div
                        className={`teamMemberCardContentWrapper orangeHighlight`}
                    >
                        <div className={`teamMemberCardContent`}>
                            <div className="memberCardPfpWrapper">
                                <img
                                    className={`memberCardPfp orangeHalo`}
                                    src={profileIconSrc}
                                />
                                <h4
                                    className={`memberCardSummonerID noWrapText orangeTextHalo`}
                                >
                                    <a
                                        href={`https://www.op.gg/summoners/na/${summonerID}`}
                                        target="_blank"
                                    >
                                        {summonerID}
                                    </a>
                                </h4>
                            </div>
                            <div className="memberCardRequestsButtonWrapper">
                                <button
                                    className={`memberCardAcceptRequestButton blueButtonHalo`}
                                    onClick={approveJoin}
                                >
                                    Approve
                                </button>
                                <button
                                    className={`memberCardKickButton redButtonHalo`}
                                    onClick={rejectJoin}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                        <div className={`memberCardDivider orangeHalo`} />
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
                                                className="teamMemberCardChampionIcon orangeHalo"
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

export default RequestMemberCard;
