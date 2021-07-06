const express = require('express');
const server = express();
const routes = require('./routes');

server.use(express.urlencoded({
    extended: true
}));
server.use(express.json());

server.use('/api', routes);

module.exports = server;