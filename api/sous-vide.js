const _ = require('lodash');
const commands = require('./commands');
const config = require('./config');
const { dateDiff } = require('./helper');

const STATE = {
  OFF: 'OFF',
  START_WARMING: 'START_WARMING',
  WARMING: 'WARMING',
  READY: 'READY',
  START_COOKING: 'START_COOKING',
  COOKING: 'COOKING',
  COOLING: 'COOLING',
};

const DEFAULT_SENSOR = {
  timestamps: {
    heating: null,
    off: null,
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

  history: [],
  _intervalId: null,
};


// Main decision loop for sous vide cooker
async function run(current) {
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

  switch (current.state) {
    case STATE.START_WARMING:
      current.state = STATE.WARMING;
      current.timestamps.warming = now;
      current.heating = true;
      current.heating = now;
      break;
    case STATE.WARMING:
      if (isAboveTemp) {
        current.state = STATE.READY;
        current.timestamps.ready = now;
        current.heating = false;
        current.heating = now;
      }
      break;
    case STATE.START_COOKING:
      current.state = STATE.COOKING;
      current.timestamps.cooking = now;
      break;
    case STATE.READY:
    case STATE.COOKING:
      if (isDoneCooking) {
        current.state = STATE.COOLING;
        current.timestamps.cooling = now;
        current.heating = false;
        current.heating = now;
        break;
      }

      if (!current.heating && isBelowTemp) {
        if (isRelayCool) {
          current.heating = true;
          current.heating = now;
        } else {
          suveLog(`Needs heat, but hasn't met cooldown period.`);
        }
        break;
      }

      if (current.heating && isAboveTemp) {
        current.heating = false;
        current.heating = now;
      }

      break;
    case STATE.COOLING:
      if (isBelowSafeTemp) {
        current.timestamps.end = now;
        current.state = STATE.OFF;
      }
      break;
    case STATE.OFF:
      if (sensor._intervalId) {
        clearInterval(sensor._intervalId);
      }
      break;
  }

  if (previous.state !== current.state) {
    suveLog(`Changed from ${previousState} to ${current.state}`)
  }

  if (previous.heating !== current.heating) {
    suveLog(`Changed heating from ${previousState} to ${current.state}`)
  }
}

const sensors = {
  sensor1: { name: 'Sensor 1', id: 'sensor1', ...DEFAULT_SENSOR },
  sensor2: { name: 'Sensor 2', id: 'sensor2', ...DEFAULT_SENSOR },
  sensor3: { name: 'Sensor 3', id: 'sensor3', ...DEFAULT_SENSOR },
};

function getAll(req, res) {
  return res.send(Object.values(sensors));
}

function getById(req, res) {
  const sensorId = req.params.id;
  const sensor = sensors[sensorId];
  if (!sensor) {
    return res.status(404).send({ error: true, message: `Sensor not found: ${sensorId}` });
  }
  return res.send(sensor);
}

function turnOn(req, res) {
  const sensorId = req.params.id;
  const sensor = sensors[sensorId];
  if (!sensor) {
    return res.status(404).send({ error: true, message: `Sensor not found: ${sensorId}` });
  }

  const { duration, temperature } = req.body;

  if (!duration || !temperature) {
    return res.status(400).send({ error: true, message: 'Bad Request: body.duration and body.temperature are required.' });
  }

  sensor.settings.duration = duration;
  sensor.settings.temperature = temperature;
  sensor.state = STATE.START_WARMING;

  sensor._intervalId = setInterval(() => run(sensor), 1000);
  return res.send({ message: 'Started sensor' });
}

function turnOff(req, res) {
  const sensorId = req.params.id;
  const sensor = sensors[sensorId];
  if (!sensor) {
    return res.status(404).send({ error: true, message: `Sensor not found: ${sensorId}` });
  }

  if (sensor._intervalId) {
    clearInterval(sensor._intervalId);
  }
}

function startCooking(req, res){
  const sensorId = req.params.id;
  const sensor = sensors[sensorId];
  if (!sensor) {
    return res.status(404).send({ error: true, message: `Sensor not found: ${sensorId}` });
  }

  sensor.state = STATE.START_COOKING;

  return res.send({ message: 'Started cooking' });  
}

function suveLog(message) {
  console.log('RUN>' + message);
}

module.exports = { getAll, getById, turnOn, turnOff, startCooking  };

