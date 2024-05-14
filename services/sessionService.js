const sessionDAO = require('../dao/sessionDAO');
const roundDAO = require('../dao/roundDAO');
const roundModel = require('../models/roundModel');
const sessionModel = require('../models/sessionModel');
const ms = require('ms');
const util = require('util');

exports.progressSession = async (session) => {
    if (session.inProgress === 0) return;
    if (session.roundCount === Number(process.env.CLASSIC_MAX_ROUNDS)) {
        session.inProgress = 0;
        session.endTime = new Date();
    } else {
        session.roundCount++;
    }
    return await sessionDAO.update(session);
}

exports.updateScore = async (session, score) => {
    session.finalScore = score;
    return await sessionDAO.update(session);

}

exports.getById = async (id) => {
    return await sessionDAO.readOneById(id);
}

exports.getByIdInProgress = async (id) => {
    return await sessionDAO.readOneByIdInProgress(id);
}

exports.getByUsername = async (username) => {
    return await sessionDAO.readOneByUsername(username);
}

exports.init = async (user, gameMode) => {
    // check if the user has an ongoing session
    const existingSession = await sessionDAO.readOneByUserIdInProgress(user.id);
    if (existingSession != null && existingSession.inProgress === 1) {
        throw new Error("User already has an active session");
    }
    const session = new sessionModel({
        userId: user.id,
        gameMode: gameMode,
        startTime: new Date(),
        endTime: null,
        inProgress: true,
        finalScore: 0,
        roundCount: 1
    });
    const createdSession = await sessionDAO.create(session);
    if (!createdSession) throw new Error("Could not create session.");
    return createdSession;
}

exports.finish = async (session) => {
    session.inProgress = 0;
    session.endTime = new Date();
    return await sessionDAO.update(session);
}

exports.finishAllOfUser = async (user) => {
    let session = await sessionDAO.readOneByUserIdInProgress(user.id);
    while (session != null) {
        {
            session.inProgress = 0;
            session.endTime = new Date();
            await sessionDAO.update(session);
            session = await sessionDAO.readOneByUserIdInProgress(user.id);
        }
    }
}
