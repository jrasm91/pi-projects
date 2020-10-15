const commands = require('./commands');

const Sensors = {
	POOL: '28-000009640cfd',
	AIR: '28-000009640cfd',
};

async function getAirTemp(req, res) {
	try {
		const { temperature, date } = await commands.getSensorTemp(Sensors.AIR);
		return res.send({ temperature, date });
	} catch (error) {
		return res.status(500).send('Unable to get air temperature');
	}
}

async function getPoolTemp(req, res) {
	try {
		const { temperature, date } = await commands.getSensorTemp(Sensors.POOL);
		return res.send({ temperature, date });
	} catch (error) {
		return res.status(500).send('Unable to get pool temperature');
	}
}

async function getAirHistory(req, res) {
	try {
		const results = await commands.readCSV('./data/air_temp_history.csv');
		results.forEach(result => {
			result[0] = parseFloat(result[0]);
		});
		return res.send(results);
	} catch (error) {
		console.error(Error);
		return res.status(500).send(`Unable to get air history: ${error}`);
	}
}

async function getPoolHistory(req, res) {
	try {
		const results = await commands.readCSV('./data/pool_temp_history.csv');
		results.forEach(result => {
			result[0] = parseFloat(result[0]);
		});
		return res.send(results);
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Unable to get pool history: ${error}`);
	}
}

// Outside Temperature
module.exports = {
	getAirTemp,
	getPoolTemp,
	getAirHistory,
	getPoolHistory
};
