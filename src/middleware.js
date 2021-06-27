const express = require('express');
const app = express();
const rateLimit = require("express-rate-limit");
const apiRouter = require('./routes');

// Rate limit a IP adress for 5 minutes after 25 calls
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 25
});

const logger = function (req, res, next) {
    const dateTime = new Date();
    const logmss = 'Log: ' + dateTime;

    console.log(logmss);
    next()
}

apiRouter.use(limiter);
apiRouter.use(logger);

module.exports = apiRouter;