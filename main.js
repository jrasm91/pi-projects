const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const api = require('./api');

const port = process.env.PORT || 4201;
const app = express();

// Logging
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

// Static Website
app.use(express.static('website-dev'));

// API Routes
app.use(bodyParser.json());
app.use('/api', api);

// Start Server
app.listen(port, () => console.info(`Listening on Port ${port}`));
