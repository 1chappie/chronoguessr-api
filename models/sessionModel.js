class sessionModel {
    constructor({id, userId, gameMode, startTime, endTime, inProgress, finalScore, roundCount}) {
        this.id = id || null;
        this.userId = userId;
        this.gameMode = gameMode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.inProgress = inProgress;
        this.finalScore = finalScore;
        this.roundCount = roundCount;
    }
}

module.exports = sessionModel;