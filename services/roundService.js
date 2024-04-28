const roundDAO = require('../dao/roundDAO');
const roundModel = require('../models/roundModel');
const sessionModel = require('../models/sessionModel');
const ms = require('ms');
const util = require('util');

function randomDate() {
    const start = new Date(process.env.EARLIEST_YEAR, 0, 1);
    const end = new Date(process.env.LATEST_YEAR, 1, 1);

    // generate a random date between the end date and start date;
    // the resulting date string must have the format "DD/MM/YYYY"
    // if the year is < 0, BC must be appended to the year

    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear() < 0 ? Math.abs(date.getFullYear()) + "BC" : date.getFullYear();
    return [day.toString(), month.toString(), year.toString()];
}

function createRRLink() {
    const [day, month, year] = randomDate();
    const rrLink = util.format(process.env.RR_LINK, day, month, year);
    return rrLink;
}

exports.createNext = async (session) => {
    // if(!session) throw new Error("Session is required.")
    // if(session.gameMode === "classic" && session.roundCount === process.env.CLASSIC_MAX_ROUNDS) {
    //     // session.inProgress = false;
    //     // session.endTime = new Date();
    //     // const updatedSession = await sessionDAO.update(session);
    //     // if(!updatedSession) throw new Error("Could not end session.");
    //     return null;
    // }

    // acting as if it s the first round
    const round = new roundModel({
        sessionId: session.id,
        roundNumber: session.roundCount + 1,
        startTime: new Date(),
        endTime: null,


    });
    const createdRound = await roundDAO.create(round);
    if (!createdRound) throw new Error("Could not create round.");
    return createdRound;
}

