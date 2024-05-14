const rtokenDAO = require('../dao/rtokenDAO.js');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const rtokenModel = require("../models/rtokenModel");

const _generateAccessToken = (user) => {
    return jwt.sign(
        {
            "username": user.username,
            "role": user.role,
            "email": user.email,
            "region": user.region
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_LIFE}
    );
}

const _generateRefreshToken = (user) => {
    return jwt.sign(
        {
            "username": user.username,
            "role": user.role,
            "email": user.email,
            "region": user.region
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_LIFE}
    );
}


exports.generateTokens = async (user) => {
    const accessToken = _generateAccessToken(user);
    let rtoken = await rtokenDAO.readOneByUserId(user.id);
    if (!rtoken) {
        const newRefreshTokenValue = _generateRefreshToken(user);
        rtoken = await rtokenDAO.create({
            userId: user.id,
            token: newRefreshTokenValue,
            expiresAt: new Date(Date.now() + ms(process.env.REFRESH_TOKEN_LIFE))
        });
    }
    return [accessToken, rtoken.token];
}

exports.refreshAccessToken = async (refreshTokenValue) => {
    if(!refreshTokenValue) throw new Error("No refresh token provided");
    if (!await rtokenDAO.readOneByToken(refreshTokenValue))
        throw new Error("Invalid refresh token");
    let newAccessToken;
    jwt.verify(
        refreshTokenValue,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) throw new Error("Invalid refresh token")
            newAccessToken = _generateAccessToken(
                decoded.username,
                decoded.role,
                decoded.email,
                decoded.region
            )
        });
    return newAccessToken;
}

exports.saveRefreshToken = async (userId, token, expiresAt) => {
    const rtoken = new rtokenModel({
        userId: userId,
        token: token,
        expiresAt: expiresAt
    });
    const createdRtoken = await rtokenDAO.create(rtoken);
    if (!createdRtoken) throw new Error("Could not create refresh token.");
    return createdRtoken;
}

exports.getByUserId = async (userId) => {
    const rtoken = await rtokenDAO.readOneByUserId(userId);
    if (!rtoken) throw new Error("Refresh token not found.");
    else if (new Date() > rtoken.expiresAt) {
        await rtokenDAO.deleteByUserId(userId);
        throw new Error("Refresh token expired.");
    }
    return rtoken;
}

exports.deleteByToken = async (rt) => {
    return await rtokenDAO.deleteByToken(rt);
}

exports.deleteByUserId = async (userId) => {
    return await rtokenDAO.deleteByUserId(userId);
}

exports.decode = (token) => {
    try {
        token = token.split(' ')[1];
        return jwt.decode(token);
    } catch (err) {
        return null;
    }
}