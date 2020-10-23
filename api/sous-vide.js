const _ = require('lodash');
const commands = require('./commands');
const config = require('./config');
const { dateDiff } = require('./helper');
const websockets = require('./websockets');

const STATE = {
  OFF: 'OFF',
  START_WARMING: 'START_WARMING',
  WARMING: 'WARMING',
  READY: 'READY',
  START_COOKING: 'START_COOKING',
  COOKING: 'COOKING',
  START_COOLING: 'START_COOLING',
  COOLING: 'COOLING',
};

const DEFAULT_SENSOR = {
  timestamps: {
    heating: null,
    off: new Date(),
    warming: null,
    ready: null,
    cooking: null,
    cooling: null,
  },
  state: STATE.OFF,
  heating: false,
  temperature: null,
  lastUpdated: null,
  settings: {
    duration: null,
    temperature: null,
  },
  _intervalId: null,
};

// Main decision loop for sous vide cooker
async function mainLoop(current) {
  const previous = _.cloneDeep(current);

  suveLog(`Starting ${current.name}/${current.id}`);

  const { temperature } = await commands.getSensorTemp(current.id);
  const now = new Date();
  current.temperature = temperature;
  current.lastUpdated = now;

  const isAboveTemp = current.temperature >= current.settings.temperature;
  const isBelowTemp = current.temperature < (current.settings.temperature - config.MAX_TEMPERATURE_DROP);
  const isBelowSafeTemp = current.temperature < config.SAFE_TEMPERATURE;

  const isRelayCool = dateDiff(now, current.timestamps.heating) > config.MIN_HEATING_COOLDOWN;
  const isDoneCooking = current.timestamps.cooking && dateDiff(now, current.timestamps.cooking) > current.settings.duration;

  function heating(onoff) {
    current.heating = onoff;
    current.timestamps.heating = now;
  }

  function toCooling() {
    current.state = COOLING;
    current.timestamps.cooling = now;
  }

  function toWarming() {
    current.state = STATE.WARMING;
    current.timestamps.warming = now;
    heating(true);
  }

  function toReady() {
    current.state = STATE.READY;
    current.timestamps.ready = now;
    heating(false);
  }

  function toCooking() {
    current.state = STATE.COOKING;
    current.timestamps.cooking = now;
  }

  function toCooling() {
    current.state = STATE.COOLING;
    current.timestamps.cooling = now;
    heating(false);
  }

  function toOff() {
    current.state = STATE.OFF;
    current.timestamps.end = now;
  }

  switch (current.state) {
    case STATE.START_WARMING:
      toWarming();
      break;
    case STATE.WARMING:
      if (isAboveTemp) {
        toReady();
      }
      break;
    case STATE.START_COOKING:
      toCooking();
      break;
    case STATE.READY:
    case STATE.COOKING:
      if (isDoneCooking) {
        toCooling();
        break;
      }

      if (!current.heating && isBelowTemp) {
        if (isRelayCool) {
          heating(true);
        } else {
          suveLog(`Needs heat, but hasn't met cooldown period.`);
        }
        break;
      }

      if (current.heating && isAboveTemp) {
        heating(false);
      }

      break;
    case STATE.START_COOLING:
      toCooling();
      break;
    case STATE.COOLING:
      if (isBelowSafeTemp) {
        toOff();
      }
      break;
    case STATE.OFF:
      if (current._intervalId) {
        clearInterval(current._intervalId);
      }
      break;
  }

  if (previous.state !== current.state) {
    suveLog(`Changed from ${previous.tate} to ${current.state}`)
  }

  if (previous.heating !== current.heating) {
    suveLog(`Changed heating from ${previous.heating} to ${current.heating}`)
  }

  const cookerUpdate = Object.assign({}, current);
  delete cookerUpdate._intervalId;
  websockets.sendMessage('cooker_update', cookerUpdate);
}

const sensors = [
  { name: 'Sensor 1', id: 'sensor1', ...DEFAULT_SENSOR },
];

function sensorMiddleware() {
  return function (req, res, next) {
    const sensorId = req.params.id;
    const sensor = sensors[sensorId];
    if (!sensor) {
      return res.status(404).send({ error: true, message: `Sensor not found: ${sensorId}` });
    }
    req.sensor = sensor;
    next();
  }
}

const getAll = (req, res) => res.send(sensors);
const getById = (req, res) => res.send(req.sensor);

function turnOn(req, res) {
  const { duration, temperature } = req.body;
  if (!duration || !temperature) {
    return res.status(400).send({ error: true, message: 'Bad Request: body.duration and body.temperature are required.' });
  }

  const sensor = req.sensor;
  if (sensor.state !== STATE.OFF) {
    return res.status(400).send({ error: true, message: 'Bad Request: sensor is not stopped' });
  }

  sensor.settings = { temperature, duration, minTemperature: temperature - config.TEMPERATURE_THRESHOLD }
  sensor.state = STATE.START_WARMING;

  if (!sensor._intervalId) {
    sensor._intervalId = setInterval(async () => {
      try {
        await mainLoop(sensor)
      } catch (error) {
        console.error('Problem with sous-vide main loop, aborting.');
        console.error(error);
        clearInterval(sensor._intervalId);
      }
    }, config.LOOP_INTERVAL * 1000);
  }

  sendUpdate(sensor);
  return res.sendStatus(201);
}

function turnOff(req, res) {
  const sensor = req.sensor;
  sensor.state = STATE.START_COOLING;
  Object.assign(sensor.settings, DEFAULT_SENSOR.settings);
  sendUpdate(sensor);
  return res.sendStatus(201);
}

function pause(req, res) {
  const sensor = req.sensor;
  if (this._intervalId) {
    clearInterval(this._intervalId);
  }
  sendUpdate(sensor);
  return res.sendStatus(201);
}

function resume(req, res) {
  const sensor = req.sensor;
  if (!this._intervalId) {
    sensor._intervalId = setTimeout()
  }
  sendUpdate(sensor);
  return res.sendStatus(201);
}

function startCooking(req, res) {
  const sensor = req.sensor;
  sensor.state = STATE.START_COOKING;
  sendUpdate(sensor);
  return res.sendStatus(201);
}

function sendUpdate(sensor) {
  const clean = { ...sensor };
  delete clean._intervalId;
  websockets.sendMessage('cooker_update', clean);
}

function suveLog(message) {
  console.log('SOUS>' + message);
}

module.exports = {
  sensorMiddleware,
  getAll,
  getById,
  turnOn,
  turnOff,
  pause,
  resume,
  startCooking,
};

