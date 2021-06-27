const server = require('./src/server.js')

const port = process.env.PORT || 3000;

server.listen(3000, () => {
    console.log('Listening on port ' + port);
})
