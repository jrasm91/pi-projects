const config = {
  POOL_SENSOR_ID: '28-000009640cfd',
  AIR_SENSOR_ID: '28-000009640cfd',

  MAX_TEMPERATURE_DROP: 3, // in degrees
  MIN_HEATING_COOLDOWN: 60, // in seconds
  COOLING_DURATION: 180, // in seconds
  SAFE_TEMPERATURE: 100, // in degrees
  LOOP_INTERVAL: 5, // in seconds,

  cookers: [
    { name: 'Cooker #1', sensorId: '28-0000096578cc', gpio: 21, },
    { name: 'Cooker #2', sensorId: '28-00000976e714', gpio: 20, },
    { name: 'Cooker #3', sensorId: '28-000009763e8a', gpio: 26, },
  ],
};

module.exports = config;
