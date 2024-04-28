const jwt = require('jsonwebtoken');

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

