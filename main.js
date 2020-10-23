const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const morgan = require('morgan');

const api = require('./api');
const config = require('./api/config');
const websockets = require('./api/websockets');

const port = process.env.PORT || 4201;
const app = express();
const server = http.createServer(app);

// Logging
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

// Static Website
app.use(express.static('website-dev'));

// API Routes
app.use(bodyParser.json());
app.use('/api', api);

// Start Server
server.listen(port, () => console.info(`Listening on Port ${port}`));
websockets.listen(server);

process.on('SIGINT', () => process.exit());
process.on('SIGUSR1', () => process.exit());
process.on('SIGUSR2', () => process.exit());
process.on('exit', exitHandler);

function exitHandler() {
  console.log('Cleaning up GPIO');
  for (const cooker of config.cookers) {
    if (cooker._gpio) {
      cooker._gpio.writeSync(0);
      cooker._gpio.unexport();
    }
  }
  process.exit();
}
