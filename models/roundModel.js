class roundModel {
    constructor({id, sessionId, roundNumber, startTime, endTime, expectedYear, answeredYear, rrLink, score}) {
        this.id = id || null;
        this.sessionId = sessionId;
        this.roundNumber = roundNumber;
        this.startTime = startTime;
        this.endTime = endTime;
        this.expectedYear = expectedYear;
        this.answeredYear = answeredYear;
        this.rrLink = rrLink;
        this.score = score;
    }
}


module.exports = roundModel;