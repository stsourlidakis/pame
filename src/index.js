#!/usr/bin/env node
const os = require('os');
const fs = require('fs');
const commander = require('commander');
const chalk = require('chalk');
const open = require('open');
const openEditor = require('open-editor');
const getLink = require('./utils/getLink');
const { version } = require('../package.json');

class Pame {
	constructor(options, args = []) {
		this.options = options;
		this.args = args;
		this.configPath =
			process.env.PAME_CONFIG || `${os.homedir()}/.pame.config.json`;
		this.config = this.readConfig();
	}

	main() {
		if (this.options.config) {
			try {
				openEditor([this.configPath]);
				this.log(this.styleCode(this.configPath));
			} catch (error) {
				this.logError(error.message);
				this.log(`You can find your config at: ${this.styleCode(this.configPath)}`);
			}
			return;
		}

		if (this.options.configShow) {
			this.log(JSON.stringify(this.config, null, 2));
			return;
		}

		if (Object.keys(this.config).length === 0) {
			this.logError(`Your config is empty`);
			this.log(
				`You can open your config with ${this.styleCode(
					'pame --config'
				)} or find it at ${this.styleCode(this.configPath)}`
			);
			return;
		}

		if (this.args.length === 0) {
			this.log(
				`Please provide at least one argument e.g. "${this.styleCode(
					`pame ${Object.keys(this.config)[0]}`
				)}"`
			);
			return;
		}

		try {
			const link = getLink(this.args, this.config);
			if (link === '') {
				throw new Error('Invalid link');
			}

			this.log(link);

			if (!this.options.dryRun) {
				open(link);
			}
			return;
		} catch (error) {
			this.logError(error.message);
			process.exit(1);
		}
	}

	readConfig() {
		try {
			const fileContents = fs.readFileSync(this.configPath, 'utf8');
			return JSON.parse(fileContents);
		} catch (error) {
			this.logError(`Error while reading config "${this.configPath}"`);
			this.logError(error.message);
			process.exit(1);
		}
	}

	log(msg) {
		console.log(msg);
	}

	logInfo(msg) {
		console.log(chalk.blue(msg));
	}

	logError(msg) {
		console.error(chalk.red(msg));
	}

	styleCode(msg) {
		return chalk.blue.italic(msg);
	}
}

const program = new commander.Command();

program.version(version);

program
	.option('--config', 'Open the config file')
	.option('--config-show', "Show the config's contents")
	.option('--dry-run', 'Just print the url');

program.parse(process.argv);

new Pame(program.opts(), program.args).main();
