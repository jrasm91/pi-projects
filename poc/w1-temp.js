var W1Temp = require('w1temp');

async function main() {
  const temp1 = await getTemperature('28-0000095d9d0d');
  console.log('Temp1:', temp1, '°F');

  const temp2 = await getTemperature('28-00000976e714');
  console.log('Temp2:', temp2, '°F');
}

async function getTemperature(sensorId) {
  const sensor = await W1Temp.getSensor(sensorId);
  return sensor.getTemperature() * 9 / 5 + 32;
}

main()
  .catch(() => process.exit(1))
  .then(() => process.exit());

// turn on gpio pin 3 as W1 power if you want to
//W1Temp.setGpioPower(3);

// set gpio pin 4 to use as W1 data channel
// if is not set by instructions above (required root permissions)
//W1Temp.setGpioData(4);

// print list of available sensors uids (ex.: [ '28-00000636a3e3' ])
//W1Temp.getSensorsUids().then(function (sensorsUids) {
//  console.log(sensorsUids);
//});

// get instance of temperature sensor

  //temp_f = round(temp_c * 9.0 / 5.0 + 32.0,2)
  // print actual temperature on changed
  //sensor.on('change', function (temp) {
  //console.log('Temp changed:', temp, '°C');
  //);
//
