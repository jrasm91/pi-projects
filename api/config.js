const config = {
  POOL_SENSOR_ID: '28-000009640cfd',
  AIR_SENSOR_ID: '28-000009640cfd',
  SENSOR_IDS = [
    { sensorId: '28-000009640cfd', gpio: 1, },
    { sensorId: '28-000009640cfd', gpio: 2, },
    { sensorId: '28-000009640cfd', gpio: 3, },
  ],
  MAX_TEMPERATURE_DROP: 3, // in degrees
  MIN_HEATING_COOLDOWN: 60, // in seconds
  COOLING_DURATION: 180, // in seconds
  SAFE_TEMPERATURE: 100, // in degrees
};

module.exports = config;
