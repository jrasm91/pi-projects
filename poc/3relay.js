var Gpio = require('onoff').Gpio

var LED1 = new Gpio(26, 'out')
LED1.writeSync(1)
var LED2 = new Gpio(20, 'out')
LED2.writeSync(1)
var LED3 = new Gpio(21, 'out')
LED3.writeSync(1)

async function main () {
  // do in order?
  await sleep(10000)
  LED1.writeSync(0)
  await sleep(2000)
  LED2.writeSync(0)
  await sleep(2000)
  LED3.writeSync(0)
  await sleep(2000)
  LED1.writeSync(1)
  await sleep(2000)
  LED2.writeSync(1)
  await sleep(2000)
  LED3.writeSync(1)
  await sleep(2000)
  LED1.writeSync(0)
  await sleep(2000)
  LED2.writeSync(0)
  await sleep(2000)
  LED3.writeSync(0)
  await sleep(2000)
  LED1.writeSync(1)
  await sleep(2000)
  LED2.writeSync(1)
  await sleep(2000)
  LED3.writeSync(1)
  await sleep(2000)

  // Stop after 10 seconds
  // await sleep(30000);
  cleanupLED(LED1)
  cleanupLED(LED2)
  cleanupLED(LED3)
}
async function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

function cleanupLED (LED) {
  LED.writeSync(0)
  LED.unexport()
}

main()
  .catch(() => process.exit(1))
  .then(() => process.exit())

// wave 3 relay board - Channel 1 RPi Pin 37 (Wave P25) BCM 26
// wave 3 relay board - Channel 2 RPi Pin 38 (Wave P28) BCM 20
// wave 3 relay board - Channel 3 RPi Pin 40 (Wave P29) BCM 21
