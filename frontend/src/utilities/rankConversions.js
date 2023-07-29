// converting percentage distribution of ranks from 06/07/23 to standard deviations of a normal distribution with a standard deviation of 1.

const RANK_TO_SD = {
    CHALLENGERI: 2.2,
    GRANDMASTERI: 2.2,
    MASTERI: 2.2,
    DIAMONDI: 2.1,
    DIAMONDIII: 2.0,
    DIAMONDIII: 1.8,
    DIAMONDIV: 1.7,
    PLATINUMI: 1.6,
    PLATINUMII: 1.4,
    PLATINUMIII: 1.3,
    PLATINUMIV: 1.2,
    GOLDI: 0.9,
    GOLDII: 0.8,
    GOLDIII: 0.6,
    GOLDIV: 0.5,
    SILVERI: 0.2,
    SILVERII: 0.0,
    SILVERIII: 0.0,
    SILVERIV: -0.2,
    BRONZEI: -0.5,
    BRONZEII: -0.7,
    BRONZEIII: -0.9,
    BRONZEIV: -1.1,
    IRONI: -1.5,
    IRONII: -1.8,
    IRONIII: -2.2,
    IRONIV: -3.3,
};

const RANK_SD_ARRAY = [
    { tier: "IRON", rank: "IV", SD: -3.3 },
    { tier: "IRON", rank: "III", SD: -2.2 },
    { tier: "IRON", rank: "II", SD: -1.8 },
    { tier: "IRON", rank: "I", SD: -1.5 },
    { tier: "BRONZE", rank: "IV", SD: -1.1 },
    { tier: "BRONZE", rank: "III", SD: -0.9 },
    { tier: "BRONZE", rank: "II", SD: -0.7 },
    { tier: "BRONZE", rank: "I", SD: -0.5 },
    { tier: "SILVER", rank: "IV", SD: -0.2 },
    { tier: "SILVER", rank: "III", SD: 0 },
    { tier: "SILVER", rank: "II", SD: 0 },
    { tier: "SILVER", rank: "I", SD: 0.2 },
    { tier: "GOLD", rank: "IV", SD: 0.5 },
    { tier: "GOLD", rank: "III", SD: 0.6 },
    { tier: "GOLD", rank: "II", SD: 0.8 },
    { tier: "GOLD", rank: "I", SD: 0.9 },
    { tier: "PLATINUM", rank: "IV", SD: 1.2 },
    { tier: "PLATINUM", rank: "III", SD: 1.3 },
    { tier: "PLATINUM", rank: "II", SD: 1.4 },
    { tier: "PLATINUM", rank: "I", SD: 1.6 },
    { tier: "DIAMOND", rank: "IV", SD: 1.7 },
    { tier: "DIAMOND", rank: "III", SD: 1.8 },
    { tier: "DIAMOND", rank: "II", SD: 2 },
    { tier: "DIAMOND", rank: "I", SD: 2.1 },
    { tier: "MASTER", rank: "I", SD: 2.2 },
    { tier: "GRANDMASTER", rank: "I", SD: 2.2 },
    { tier: "CHALLENGER", rank: "I", SD: 2.2 },
];

const BinarySearch = (target) => {
    let left = 0;
    let right = RANK_SD_ARRAY.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (RANK_SD_ARRAY[mid]["SD"] === target) {
            return {
                tier: RANK_SD_ARRAY[mid]["tier"],
                rank: RANK_SD_ARRAY[mid]["rank"],
            };
        } else if (RANK_SD_ARRAY[mid]["SD"] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return {
        tier: RANK_SD_ARRAY[left]["tier"],
        rank: RANK_SD_ARRAY[left]["rank"],
    };
};

export const getAverageRank = (ranks) => {
    let avgRankSD =
        ranks.reduce((rankSum, currRank) => rankSum + RANK_TO_SD[currRank], 0) /
        ranks.length;
    let avgRank = BinarySearch(avgRankSD);
    return avgRank;
};

export const compareRank = (rankA, rankB) => {
    const ranks = Object.keys(RANK_TO_SD);
    return ranks.indexOf(rankA) - ranks.indexOf(rankB);
};
