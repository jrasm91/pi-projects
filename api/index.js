const express = require('express');
const air = require('./air');
const pool = require('./pool');
const sv = require('./sous-vide')
const zones = require('./zones');

const api = express.Router();

// Pool Temperature
api.get('/pool/temperature', pool.getTemperature);
api.get('/pool/history', pool.getHistory);

// Air Temperature
api.get('/air/temperature', air.getTemperature);
api.get('/air/history', air.getHistory);

api.get('/sous-vide/sensors', sv.getAll);
api.get('/sous-vide/sensors/:id', sv.getById);
api.post('/sous-vide/sensors/:id/on', sv.turnOn);
api.post('/sous-vide/sensors/:id/start-cooking', sv.startCooking);
api.post('/sous-vide/sensors/:id/off', sv.turnOff);

// Zones
api.get('/zones', zones.getAll);
api.post('/zones', zones.create);
api.get('/zones/:id', zones.getById);
api.put('/zones/:id', zones.update);
api.delete('/zones', zones.remove);

module.exports = api;
