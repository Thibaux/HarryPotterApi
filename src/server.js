const express = require('express');
const server = express();
const routes = require('./routes');

server.use('/api', routes);

module.exports = server;