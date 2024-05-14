const express = require('express');
const router = express.Router();
const sessionService = require('../services/sessionService');
const roundService = require('../services/roundService');
const {isAuthenticated} = require('../middleware/authCheck');
const tokenService = require('../services/tokenService');
const userService = require('../services/userService');


exports.createClassicSession = async (req, res, next) => {
    const username = tokenService.decode(req.headers['authorization']).username;
    try {
        const user = await userService.getOne(username);
        const session = await sessionService.init(user, 'classic');
        const round = await roundService.yield({session: session, answer: null});
        res.status(201).json({...session, round: round});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

exports.createBlitzSession = async (req, res, next) => {
    // TODO
}

exports.createCasualSession = async (req, res, next) => {
    // TODO
}

exports.submitAnswer = async (req, res, next) => {
    try {
        // const round_id = req.params.round_id;
        let session = await sessionService.getById(req.params.session_id);
        let round = await roundService.yield({
            session: session,
            answer: req.body.answer
        });
        session = await sessionService.progressSession(session);
        // ^ this is MANDATORY and tied to yield, because it increments
        // the round count and checks if the session is finished.
        // yield creates a round entity with a higher count anyway,
        // but i wanted to separate the domain concerns, this is why
        // the round number increments happen separately
        if(session.inProgress === 0) {
            const totalScore = await roundService.totalScore(session);
            await sessionService.updateScore(session, totalScore);
            await roundService.clearRounds(session);
            round = null;
        }
        res.status(200).json({...session, round});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

exports.abortSession = async (req, res, next) => {
    try {
        const session = await sessionService.getByIdInProgress(req.params.session_id);
        await sessionService.finish(session);
        await roundService.clearRounds(session);
        res.status(200).json({message: 'Session aborted'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}