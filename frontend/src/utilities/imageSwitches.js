import IronEmblem from "../assets/RankedEmblems/emblem-iron.png";
import BronzeEmblem from "../assets/RankedEmblems/emblem-bronze.png";
import SilverEmblem from "../assets/RankedEmblems/emblem-silver.png";
import GoldEmblem from "../assets/RankedEmblems/emblem-gold.png";
import PlatinumEmblem from "../assets/RankedEmblems/emblem-platinum.png";
import DiamondEmblem from "../assets/RankedEmblems/emblem-diamond.png";
import MasterEmblem from "../assets/RankedEmblems/emblem-master.png";
import GrandmasterEmblem from "../assets/RankedEmblems/emblem-grandmaster.png";
import ChallengerEmblem from "../assets/RankedEmblems/emblem-challenger.png";

import TopImage from "../assets/Positions/Position_Challenger-Top.png";
import JungleImage from "../assets/Positions/Position_Challenger-Jungle.png";
import MidImage from "../assets/Positions/Position_Challenger-Mid.png";
import BotImage from "../assets/Positions/Position_Challenger-Bot.png";
import SuppImage from "../assets/Positions/Position_Challenger-Support.png";

import MasteryOne from "../assets/MasteryEmblems/mastery-1.png";
import MasteryTwo from "../assets/MasteryEmblems/mastery-2.png";
import MasteryThree from "../assets/MasteryEmblems/mastery-3.png";
import MasteryFour from "../assets/MasteryEmblems/mastery-4.png";
import MasteryFive from "../assets/MasteryEmblems/mastery-5.png";
import MasterySix from "../assets/MasteryEmblems/mastery-6.png";
import MasterySeven from "../assets/MasteryEmblems/mastery-7.png";

export const rankImgSwitch = (rank) => {
    if (rank === "IRON") {
        return IronEmblem;
    } else if (rank === "BRONZE") {
        return BronzeEmblem;
    } else if (rank === "SILVER") {
        return SilverEmblem;
    } else if (rank === "GOLD") {
        return GoldEmblem;
    } else if (rank === "PLATINUM") {
        return PlatinumEmblem;
    } else if (rank === "DIAMOND") {
        return DiamondEmblem;
    } else if (rank === "MASTER") {
        return MasterEmblem;
    } else if (rank === "GRANDMASTER") {
        return GrandmasterEmblem;
    } else if (rank === "CHALLENGER") {
        return ChallengerEmblem;
    }
};

export const positionImgSwitch = (rank) => {
    if (rank === "Top") {
        return TopImage;
    } else if (rank === "Jungle") {
        return JungleImage;
    } else if (rank === "Mid") {
        return MidImage;
    } else if (rank === "Bot") {
        return BotImage;
    } else if (rank === "Support") {
        return SuppImage;
    }
};

export const masteryImgSwitch = (mastery) => {
    if (mastery === 1) {
        return MasteryOne;
    } else if (mastery === 2) {
        return MasteryTwo;
    } else if (mastery === 3) {
        return MasteryThree;
    } else if (mastery === 4) {
        return MasteryFour;
    } else if (mastery === 5) {
        return MasteryFive;
    } else if (mastery === 6) {
        return MasterySix;
    } else if (mastery === 7) {
        return MasterySeven;
    }
};
