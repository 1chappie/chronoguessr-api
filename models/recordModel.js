class recordModel{
    constructor(id, userId, gameMode, score, createdAt, region) {
        this.id = id;
        this.userId = userId;
        this.gameMode = gameMode;
        this.score = score;
        this.createdAt = createdAt;
        this.region = region;
    }
}

module.exports = recordModel;