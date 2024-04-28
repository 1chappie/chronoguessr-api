const tokenService = require('../services/tokenService.js');
const userService = require('../services/userService.js');
const ms = require('ms');

function createRTCookie(res, refreshToken) {
    res.cookie(
        'jwtRT',
        refreshToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms(process.env.REFRESH_TOKEN_LIFE)
        }
    )
}

exports.login = async (req, res, next) => {
    try {
        const user = await userService.validatePassword(
            req.body.identifier,
            req.body.password
        );
        [accessToken, refreshToken] = await tokenService.generateTokens(user);
        createRTCookie(res, refreshToken);
        res.json({accessToken});
    } catch (error) {
        console.log(error);
        res.status(403).json({error: "Invalid credentials"});
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwtRT)
            res.status(401).json({error: "No refresh token provided"});
        res.json({accessToken: await tokenService.refreshAccessToken(cookies.jwtRT)});
    } catch (error) {
        console.log(error);
        res.status(403).json({error: "Invalid refresh token"});
    }
};

exports.register = async (req, res, next) => {
    try {
        const user = await userService.create(
            req.body.username,
            req.body.password,
            req.body.email,
            req.body.region
        );
        [accessToken, refreshToken] = await tokenService.generateTokens(user);
        createRTCookie(res, refreshToken);
        res.json({accessToken});
    } catch (error) {
        console.log(error);
        res.status(409).json({error: "Could not create user"});
    }

}

exports.logout = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwtRT)
            res.status(204).json({error: "No refresh token provided"});
        await tokenService.deleteByToken(cookies.jwtRT);
        res.clearCookie('jwtRT', {httpOnly: true, secure: true, sameSite: 'none'});
        res.json({message: "Logged out"});
    } catch (error) {
        console.log(error);
        res.status(403).json({error: "Invalid refresh token"});
    }
}
