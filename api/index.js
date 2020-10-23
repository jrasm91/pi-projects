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

api.get('/sous-vide/cookers', sv.getAll);
api.get('/sous-vide/cookers/:id', sv.cookerMiddleware(), sv.getById);
api.post('/sous-vide/cookers/:id/turnOn', sv.cookerMiddleware(), sv.turnOn);
api.post('/sous-vide/cookers/:id/turnOff', sv.cookerMiddleware(), sv.turnOff);
api.post('/sous-vide/cookers/:id/pause', sv.cookerMiddleware(), sv.pause);
api.post('/sous-vide/cookers/:id/resume', sv.cookerMiddleware(), sv.resume);
api.post('/sous-vide/cookers/:id/start-cooking', sv.cookerMiddleware(), sv.startCooking);

// Zones
api.get('/zones', zones.getAll);
api.post('/zones', zones.create);
api.get('/zones/:id', zones.getById);
api.put('/zones/:id', zones.update);
api.delete('/zones', zones.remove);

module.exports = api;
