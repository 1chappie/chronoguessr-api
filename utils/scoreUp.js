exports.scoreUp = (expected, given) => {
    let score = 0;
    if (expected === given) {
        score = process.env.CLASSIC_BASE_SCORE;
    } else {
        const difference = Math.abs(given - expected);
        if (difference <= 200) {
            score = Math.floor(process.env.CLASSIC_BASE_SCORE * Math.exp(-difference / 120));
        } else {
            score = 0;
        }
    }
    return score;
}