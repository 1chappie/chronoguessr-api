const roundDAO = require('../dao/roundDAO');
const roundModel = require('../models/roundModel');
const sessionModel = require('../models/sessionModel');
const ms = require('ms');
const util = require('util');
const {scoreUp} = require('../utils/scoreUp');
const {rrGen} = require('../utils/rrGen');

async function getLastRound(session) {
    // gets the last round of the session by session id
    // returns null if no round exists
    const rounds = await roundDAO.readAllBySessionId(session.id);
    if (!rounds) return null;
    return rounds[rounds.length - 1];
}

async function finishRound(round, answer) {
    if (!round) throw new Error("Round does not exist.");
    if (round.answeredYear !== null) {
        console.log("Round " + round.id + " already answered.");
        return null;
    }
    if (answer === null) throw new Error("Answer cannot be null.");
    round.answeredYear = answer;
    round.score = scoreUp(round.expectedYear, round.answeredYear);
    round.endTime = new Date();
    return await roundDAO.update(round);
}

async function generateRound(session, number) {
    // this assumes that the session knows the round count
    const rr = rrGen();
    const round = new roundModel({
        sessionId: session.id,
        roundNumber: number, // assumes session updates the round count after this
        startTime: new Date(),
        endTime: null,
        expectedYear: rr.year,
        answeredYear: null,
        rrLink: rr.rrLink,
        score: null
    });
    return await roundDAO.create(round);
}

async function timeCheck(session) {
    // todo for blitz mode
}

exports.totalScore = async (session) => {
    const rounds = await roundDAO.readAllBySessionId(session.id);
    return rounds.reduce((acc, round) => acc + round.score, 0);
}

exports.clearRounds = async (session) => {
    return await roundDAO.deleteAllBySessionId(session.id);
}

exports.yield = async ({session, answer}) => {

    // this should look at the latest round in the rounds table which has the same session id,
    // and it has the following scenarios (assumes the session takes care of round count):
    // 0. if no round exist, generate a new round with the round number 1 and return it
    // 1.0. if the latest round is not answered yet, throw an error;
    // 1.1. if the session isn't in progress, throw an error
    // 2. if the latest round if answered, call the endRound function, then
    // end the previous round and generate a new round
    // * this function should return an object representing the next round (with only the round id and rrlink)

    let lastRound = await getLastRound(session);
    let nextRound = null;
    if (session.inProgress === 0) throw new Error("Session is not in progress.");

    if (!lastRound) {
        nextRound = await generateRound(session, 1);
        if (!nextRound) throw new Error("Could not generate round.");
    } else {
        await finishRound(lastRound, answer);
        // assumes session knows the round count and the game mode
        // if(session.gameMode === "classic" && session.roundCount === process.env.CLASSIC_MAX_ROUNDS) {
        //     session.inProgress = false;
        //     session.endTime = new Date();
        //     const updatedSession = await sessionDAO.update(session);
        //     if(!updatedSession) throw new Error("Could not end session.");
        //     await clearRounds(session);
        //     return null;
        // }
        nextRound = await generateRound(session, lastRound.roundNumber + 1);
        if (!nextRound) throw new Error("Could not generate round.");
    }
    return {id: nextRound.id, rrLink: nextRound.rrLink, response: nextRound.expectedYear};

}

