import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { AiOutlineStop } from "react-icons/ai";

import RoleButton from "../Teams Display/roleButton";
import LoadingAnimation from "../Utilities/loadingAnimation";
import LoadingScreen from "../Utilities/loadingScreen";
import {
    rankImgSwitch,
    positionImgSwitch,
    masteryImgSwitch,
} from "../../utilities/imageSwitches";
import {
    getSummonerIcon,
    getChampionIcon,
} from "../../utilities/dataDragonCalls";

import services from "../../services";

function MemberCard(props) {
    const [hoveringUserPositionEmblem, setHoveringUserPositionEmblem] =
        useState(false);
    const [hideMemberDetails, setHideMemberDetails] = useState(false);
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
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

    const { mutate: kickTeammate, isLoading: kickTeammateLoading } =
        useMutation({
            mutationFn: () =>
                services.removeFromTeam({
                    summonerID: summonerID,
                    teamID: searchParams.get("teamID"),
                }),
            onSuccess: () => {
                queryClient.setQueryData(
                    ["team-data", searchParams.get("teamID")],
                    {
                        ...teamData,
                        members: teamData.members.filter(
                            (member) => member.summonerID != summonerID
                        ),
                    }
                );
            },
        });

    const { mutate: removeTeamRole, isLoading: removeTeamRoleLoading } =
        useMutation({
            mutationFn: () =>
                services.removeTeamRole({
                    summonerID: summonerID,
                    teamID: searchParams.get("teamID"),
                }),
            onSuccess: () => {
                queryClient.setQueryData(
                    ["team-data", searchParams.get("teamID")],
                    {
                        ...teamData,
                        rolesFilled: Object.keys(teamData.rolesFilled).reduce(
                            (acc, key) => {
                                console.log(key);
                                acc[key] =
                                    teamData.rolesFilled[key] == summonerID
                                        ? null
                                        : teamData.rolesFilled[key];
                                return acc;
                            },
                            {}
                        ),
                    }
                );
            },
        });

    const handleRemoveTeamRole = (event) => {
        event.stopPropagation();
        removeTeamRole();
    };

    const isUser = summonerID == localStorage.getItem("summonerID");
    const hasRole = Object.values(roles).includes(summonerID);

    const positionEmblem = () => {
        if (hasRole) {
            return (
                <img
                    className={`memberCardPositionEmblem ${
                        isUser && "userPositionEmblem"
                    }`}
                    src={positionImgSwitch(
                        Object.keys(roles).find(
                            (key) => roles[key] === summonerID
                        )
                    )}
                />
            );
        } else {
            return (
                <p
                    className={`memberCardAddPositionSign ${
                        isUser && "userPositionEmblem"
                    }`}
                >
                    +
                </p>
            );
        }
    };

    const handleMouseEnter = () => {
        if (isUser) {
            setHoveringUserPositionEmblem(true);
        }
    };

    const handleMouseLeave = () => {
        if (isUser) {
            setHoveringUserPositionEmblem(false);
        }
    };

    const selectPositionEmblem = () => {
        return (
            <div className="userSelectRolePanelWrapper">
                <div className="userSelectRolePanel">
                    {Object.entries(roles).map(([key, value], i) => {
                        if (
                            !value ||
                            value == localStorage.getItem("summonerID")
                        ) {
                            return (
                                <RoleButton
                                    key={i}
                                    role={key}
                                    summonerID={value}
                                />
                            );
                        }
                    })}
                    <div className="positionSelectionImgWrapper">
                        <AiOutlineStop
                            className="disselectRoleEmblem"
                            onClick={(event) => handleRemoveTeamRole(event)}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const userSwitchPositionEmblem = () => {
        return (
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {isUser && hoveringUserPositionEmblem
                    ? selectPositionEmblem()
                    : positionEmblem()}
            </div>
        );
    };

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
            {(removeTeamRoleLoading || kickTeammateLoading) && (
                <LoadingScreen />
            )}
            {profileIconSrcLoading || championIconSrcLoading ? (
                <LoadingAnimation />
            ) : (
                <div
                    className={`teamMemberCard`}
                    onClick={openCloseMemberDetails}
                >
                    <div
                        className={`teamMemberCardContentWrapper ${
                            isUser
                                ? "greenHighlight"
                                : hasRole
                                ? "blueHighlight"
                                : "redHighlight"
                        }`}
                    >
                        <div className={`teamMemberCardContent`}>
                            <div className="memberCardPfpWrapper">
                                <img
                                    className={`memberCardPfp ${
                                        isUser
                                            ? "greenHalo"
                                            : hasRole
                                            ? "blueHalo"
                                            : "redHalo"
                                    }`}
                                    src={profileIconSrc}
                                />
                                <h4
                                    className={`memberCardSummonerID noWrapText ${
                                        isUser
                                            ? "greenTextHalo"
                                            : hasRole
                                            ? "blueTextHalo"
                                            : "redTextHalo"
                                    }`}
                                >
                                    <a
                                        href={`https://www.op.gg/summoners/na/${summonerID}`}
                                        target="_blank"
                                    >
                                        {summonerID}
                                    </a>
                                </h4>
                            </div>
                            <div className="memberCardPositionEmblemWrapper">
                                {userSwitchPositionEmblem()}
                            </div>
                            <div className="memberCardKickButtonWrapper">
                                {summonerID !==
                                    localStorage.getItem("summonerID") && (
                                    <button
                                        className={`memberCardKickButton ${
                                            hasRole
                                                ? "blueButtonHalo"
                                                : "redButtonHalo"
                                        }`}
                                        onClick={kickTeammate}
                                    >
                                        Kick
                                    </button>
                                )}
                            </div>
                        </div>
                        <div
                            className={`memberCardDivider ${
                                isUser
                                    ? "greenHalo"
                                    : hasRole
                                    ? "blueHalo"
                                    : "redHalo"
                            }`}
                        />
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

export default MemberCard;
