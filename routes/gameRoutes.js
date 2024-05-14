const express = require('express');
const sessionService = require("../services/sessionService");
const {isAuthenticated, ownsGameSession} = require("../middleware/authCheck");
const router = express.Router();
const gameController = require('../controllers/gameController');


router.get('/session/classic', isAuthenticated, gameController.createClassicSession);
router.get('/session/blitz', isAuthenticated, gameController.createBlitzSession);
router.get('/session/casual', isAuthenticated, gameController.createCasualSession);

router.post('/session/:session_id', isAuthenticated, ownsGameSession, gameController.submitAnswer);

router.post('/session/:session_id/abort', isAuthenticated, ownsGameSession, gameController.abortSession);

module.exports = router;
