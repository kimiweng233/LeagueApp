import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import TournamentAdminBracketCard from "./tournamentAdminBracketCard";
import TournamentBracketMatchSign from "./tournamentBracketMatchSign";
import CountdownClock from "../Utilities/countDownClock";

const TournamentAdminBracket = (props) => {
    const [searchParams] = useSearchParams();

    const bracket = props.bracket;
    const startTime = props.startTime;

    const slotWidth = 350;
    const slotHeight = 140;

    const contentWidth = slotWidth * 0.9;
    const contentHeight = slotHeight * 0.8;

    const width = bracket.length * slotWidth;
    const height = Math.pow(2, bracket.length - 1) * slotHeight;

    const contentInnerBoxWidthRatio = 0.9;

    useEffect(() => {
        props.setBracketWidth(width);
        props.setBracketHeight(height);
    }, []);

    if (Object.entries(bracket).length == 0) {
        return (
            <div className="tournamentNotStartedSignWrapper">
                <p className="homePageButtonText">Tournament Starting in:</p>
                <CountdownClock targetDateTime={startTime} />
                <div className="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    } else {
        return (
            <svg width={width} height={height}>
                {bracket.map((round, roundNum) =>
                    round.map((game, gameNum) => {
                        return (
                            <g key={roundNum.toString() + gameNum.toString()}>
                                <foreignObject
                                    x={`${
                                        roundNum * slotWidth +
                                        slotWidth / 2 -
                                        contentWidth / 2 +
                                        contentWidth * 0.05 +
                                        5
                                    }`}
                                    y={`${
                                        (Math.pow(2, roundNum) - 1) *
                                            (slotHeight / 2) +
                                        gameNum *
                                            (height /
                                                Math.pow(
                                                    2,
                                                    bracket.length -
                                                        1 -
                                                        roundNum
                                                )) +
                                        slotHeight / 2 -
                                        contentHeight / 2 -
                                        5
                                    }`}
                                    width={`${contentWidth}`}
                                    height={`${contentHeight}`}
                                >
                                    <TournamentBracketMatchSign
                                        game={game}
                                        quarter={roundNum == bracket.length - 3}
                                        semi={roundNum == bracket.length - 2}
                                        final={roundNum == bracket.length - 1}
                                    />
                                </foreignObject>
                                <foreignObject
                                    x={`${
                                        roundNum * slotWidth +
                                        slotWidth / 2 -
                                        contentWidth / 2
                                    }`}
                                    y={`${
                                        (Math.pow(2, roundNum) - 1) *
                                            (slotHeight / 2) +
                                        gameNum *
                                            (height /
                                                Math.pow(
                                                    2,
                                                    bracket.length -
                                                        1 -
                                                        roundNum
                                                )) +
                                        slotHeight / 2 -
                                        contentHeight / 2
                                    }`}
                                    width={`${contentWidth}`}
                                    height={`${contentHeight}`}
                                >
                                    <TournamentAdminBracketCard
                                        game={game}
                                        advanceRound={props.advanceRound}
                                        updateScore={props.updateScore}
                                    />
                                </foreignObject>
                                {roundNum != bracket.length - 1 && (
                                    <g>
                                        <line
                                            x1={`${
                                                roundNum * slotWidth +
                                                slotWidth / 2 +
                                                contentWidth / 2 -
                                                (contentWidth *
                                                    (1 -
                                                        contentInnerBoxWidthRatio)) /
                                                    2
                                            }`}
                                            y1={`${
                                                (Math.pow(2, roundNum) - 1) *
                                                    (slotHeight / 2) +
                                                gameNum *
                                                    (height /
                                                        Math.pow(
                                                            2,
                                                            bracket.length -
                                                                1 -
                                                                roundNum
                                                        )) +
                                                slotHeight / 2
                                            }`}
                                            x2={`${
                                                roundNum * slotWidth + slotWidth
                                            }`}
                                            y2={`${
                                                (Math.pow(2, roundNum) - 1) *
                                                    (slotHeight / 2) +
                                                gameNum *
                                                    (height /
                                                        Math.pow(
                                                            2,
                                                            bracket.length -
                                                                1 -
                                                                roundNum
                                                        )) +
                                                slotHeight / 2
                                            }`}
                                            className="linkAccountButton"
                                            stroke="#dbe9ff"
                                            strokeWidth="2"
                                        />
                                        {gameNum % 2 == 1 && (
                                            <line
                                                x1={`${
                                                    roundNum * slotWidth +
                                                    slotWidth
                                                }`}
                                                y1={`${
                                                    (Math.pow(2, roundNum) -
                                                        1) *
                                                        (slotHeight / 2) +
                                                    gameNum *
                                                        (height /
                                                            Math.pow(
                                                                2,
                                                                bracket.length -
                                                                    1 -
                                                                    roundNum
                                                            )) +
                                                    slotHeight / 2
                                                }`}
                                                x2={`${
                                                    roundNum * slotWidth +
                                                    slotWidth
                                                }`}
                                                y2={`${
                                                    (Math.pow(2, roundNum) -
                                                        1) *
                                                        (slotHeight / 2) +
                                                    (gameNum - 1) *
                                                        (height /
                                                            Math.pow(
                                                                2,
                                                                bracket.length -
                                                                    1 -
                                                                    roundNum
                                                            )) +
                                                    slotHeight / 2 +
                                                    (slotHeight / 2) *
                                                        Math.pow(2, roundNum)
                                                }`}
                                                stroke="#dbe9ff"
                                                strokeWidth="2"
                                            />
                                        )}
                                        {gameNum % 2 == 0 && (
                                            <g>
                                                <line
                                                    x1={`${
                                                        roundNum * slotWidth +
                                                        slotWidth
                                                    }`}
                                                    y1={`${
                                                        (Math.pow(2, roundNum) -
                                                            1) *
                                                            (slotHeight / 2) +
                                                        gameNum *
                                                            (height /
                                                                Math.pow(
                                                                    2,
                                                                    bracket.length -
                                                                        1 -
                                                                        roundNum
                                                                )) +
                                                        slotHeight / 2
                                                    }`}
                                                    x2={`${
                                                        roundNum * slotWidth +
                                                        slotWidth
                                                    }`}
                                                    y2={`${
                                                        (Math.pow(2, roundNum) -
                                                            1) *
                                                            (slotHeight / 2) +
                                                        gameNum *
                                                            (height /
                                                                Math.pow(
                                                                    2,
                                                                    bracket.length -
                                                                        1 -
                                                                        roundNum
                                                                )) +
                                                        slotHeight / 2 +
                                                        (slotHeight / 2) *
                                                            Math.pow(
                                                                2,
                                                                roundNum
                                                            )
                                                    }`}
                                                    stroke="#dbe9ff"
                                                    strokeWidth="2"
                                                />
                                                <line
                                                    x1={`${
                                                        roundNum * slotWidth +
                                                        slotWidth
                                                    }`}
                                                    y1={`${
                                                        (Math.pow(2, roundNum) -
                                                            1) *
                                                            (slotHeight / 2) +
                                                        gameNum *
                                                            (height /
                                                                Math.pow(
                                                                    2,
                                                                    bracket.length -
                                                                        1 -
                                                                        roundNum
                                                                )) +
                                                        slotHeight / 2 +
                                                        (slotHeight / 2) *
                                                            Math.pow(
                                                                2,
                                                                roundNum
                                                            )
                                                    }`}
                                                    x2={`${
                                                        roundNum * slotWidth +
                                                        slotWidth +
                                                        slotWidth / 2 -
                                                        contentWidth / 2 +
                                                        (contentWidth *
                                                            (1 -
                                                                contentInnerBoxWidthRatio)) /
                                                            2
                                                    }`}
                                                    y2={`${
                                                        (Math.pow(2, roundNum) -
                                                            1) *
                                                            (slotHeight / 2) +
                                                        gameNum *
                                                            (height /
                                                                Math.pow(
                                                                    2,
                                                                    bracket.length -
                                                                        1 -
                                                                        roundNum
                                                                )) +
                                                        slotHeight / 2 +
                                                        (slotHeight / 2) *
                                                            Math.pow(
                                                                2,
                                                                roundNum
                                                            )
                                                    }`}
                                                    stroke="#dbe9ff"
                                                    strokeWidth="2"
                                                />
                                            </g>
                                        )}
                                    </g>
                                )}
                            </g>
                        );
                    })
                )}
            </svg>
        );
    }
};

export default TournamentAdminBracket;
