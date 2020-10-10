const { spawn } = require('child_process');

async function run(command, args) {
	return new Promise((resolve, reject) => {
		let stdout = [], stderr = [];

		console.log(`${command} ${args.join(' ')}`);
		const shell = spawn(command, args);

		shell.stdout.on('data', data => stdout.push(data.toString()));
		shell.stderr.on('data', data => stderr.push(data.toString()));

		shell.on('error', error => reject(error));
		shell.on('close', () => done());

		function clean(lines) {
			const input = lines.join().trim();
			if (!input) {
				return [];
			}
			return input.replace(/\r/g, '').split('\n');
		}

		function done() {
			stdout = clean(stdout);
			stderr = clean(stderr);
			if (stderr.length > 0) {
				stderr.map(line => console.log(`err> ${line}`));
				return reject(stderr);
			} else if (stdout.length > 0) {
				stdout.map(line => console.log(`out> ${line}`));
				return resolve(stdout);
			} else {
				console.warn('No output from script');
				return reject('No output to stdout or stderr');
			}
		}
	});
}

async function getSensorTemp(sensorId) {
	const output = await run('python3', ['./scripts/sensor_temp.py', sensorId]);
	const [temperature, date] = output[0].trim().split('|');
	return { temperature: parseFloat(temperature), date };
}

module.exports = {
	getSensorTemp,
};
