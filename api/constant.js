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

const DEFAULT_COOKER = {
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

module.exports = { DEFAULT_COOKER, STATE };
