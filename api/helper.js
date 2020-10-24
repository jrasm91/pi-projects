const GPIO = require('onoff').Gpio;
const config = require('./config');

function dateDiff(d2, d1) {
  const millis = d2 - d1;
  const seconds = millis / 1000;
  return Math.round(seconds);
}

let gpios = [];

function getGPIO(pin) {
  try {
    return new GPIO(pin, 'out');
  } catch (error) {
    console.warn(`Failed to initialize GPIO ${pin}, using mock pin instead`);
    return {
      write: async (value) => console.log(`mock_gpio>set ${pin} to ${value} (async)`),
      writeSync: value => console.log(`mock_gpio>set ${pin} to ${value} (sync)`),
      unexport: () => console.log(`mock_gpio>unexport ${pin}`),
    };
  }
}

function bindGPIO(pin) {
  const gpio = getGPIO(pin);
  gpios.push(gpio);
  return gpio;
}

function cleanupGPIOs() {
  for (const gpio of gpios) {
    gpio.writeSync(config.GPIO_OFF);
    gpio.unexport();
  }
  gpios = [];
}

module.exports = { dateDiff, bindGPIO, cleanupGPIOs };
