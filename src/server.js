const express = require('express');
const server = express();
const routes = require('./routes');

server.use(express.urlencoded({
    extended: true
}));
server.use(express.json());

server.get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    next()
})

server.use('/api', routes);

module.exports = server;