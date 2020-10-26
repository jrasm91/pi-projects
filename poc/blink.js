var Gpio = require('onoff').Gpio

var LED1 = new Gpio(21, 'out')
var LED2 = new Gpio(20, 'out')
var LED3 = new Gpio(26, 'out')

function blinkLED (LED) {
  if (LED.readSync() === 0) {
    LED.writeSync(1)
  } else {
    LED.writeSync(0)
  }
}

function blinkAll () {
  blinkLED(LED1)
  blinkLED(LED2)
  blinkLED(LED3)
}

function cleanupLED (LED) {
  LED.writeSync(0)
  LED.unexport()
}

async function main () {
  // Starts blinking every 1 second
  const interval1 = setInterval(() => blinkLED(LED1), 1000)
  await sleep(333)
  const interval2 = setInterval(() => blinkLED(LED2), 1000)
  await sleep(333)
  const interval3 = setInterval(() => blinkLED(LED3), 1000)

  // Stop after 10 seconds
  await sleep(10000)

  clearInterval(interval1)
  clearInterval(interval2)
  clearInterval(interval3)

  cleanupLED(LED1)
  cleanupLED(LED2)
  cleanupLED(LED3)
}

async function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

main()
  .catch(() => process.exit(1))
  .then(() => process.exit())

// wave 3 relay board - Channel 1 RPi Pin 37 (Wave P25) BCM 26
// wave 3 relay board - Channel 2 RPi Pin 38 (Wave P28) BCM 20
// wave 3 relay board - Channel 3 RPi Pin 40 (Wave P29) BCM 21
