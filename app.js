const express = require('express');
const app = express();
const routes = require('./src/routes');

const port = process.env.PORT || 3000;

app.use('/api', routes);

app.listen(port, () => {
    console.log('Lisening on port ' + port);
})