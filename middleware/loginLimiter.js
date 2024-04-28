const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
    windowMs: 60 * 1000, //1 minute
    max: 5, //limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again after a minute',
    handler: (req, res, next) => {
        res.status(429).send('Too many requests');
    },
    standardHeaders: true,
    legacyHeaders: false
})