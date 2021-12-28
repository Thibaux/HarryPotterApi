const server = require('./src/server.js')

const port = process.env.PORT || 3001;

server.listen(port);
