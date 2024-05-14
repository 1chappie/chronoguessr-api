const jwt = require('jsonwebtoken');
const sessionService = require("../services/sessionService");
const userService = require("../services/userService");
const tokenService = require("../services/tokenService");

exports.isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer '))
        return res.status(401).json({message: 'Unauthorized'});
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({message: 'Forbidden'});
            req.username = decoded.username;
            req.role = decoded.role;
            req.region = decoded.region;
            req.email = decoded.email;
            next();
        })
}

//todo check roles

exports.isNotAuthenticated = (req, res, next) => {
    //todo
}

exports.isAuthorized = (req, res, next) => {
//todo
}

exports.ownsGameSession = async (req, res, next) => {
    const session = await sessionService.getById(req.params.session_id);
    const username = tokenService.decode(req.headers['authorization']).username;
    const user = await userService.getOne(username);
    if(!session) return res.status(404).json({message: 'Session not found'});
    if(!user) return res.status(404).json({message: 'User not found'});
    if (session.userId === user.id) {
        next();
    } else {
        res.status(403).json({message: 'Forbidden'});
    }
}
