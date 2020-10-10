const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const api = require('./server');

const port = process.env.PORT || 5000;
const app = express();

// Logging
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

// Website
app.use(express.static('website')); 

// API
app.use(bodyParser.json());
app.use('/api', api);

// Start server
http.createServer(app).listen(port, () => {
  console.info(`Listening on Port ${port}`);
});

