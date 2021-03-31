#!/usr/bin/env node
const open = require('open');
const getLink = require('./getLink');
const config = require('./local.config.json');

const [, , ...options] = process.argv;

(function main() {
	if (options.length === 0) {
		return;
	}

	if (options[0] === '--config' || options[0] === '--help') {
		console.log(JSON.stringify(config, null, 2));
		return;
	}

	try {
		const link = getLink(options, config);
		if (link === '') {
			throw new Error('Invalid link');
		}

		console.log(link);
		open(link);
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
})();
