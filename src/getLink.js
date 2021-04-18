const v8 = require('v8');
const getClosest = require('./getClosest');
const { reservedKeys } = require('./constants');

module.exports = function getLink(args, config, pathSoFar = '') {
	const configCopy = v8.deserialize(v8.serialize(config));

	// if there are no args, return
	if (args.length === 0) {
		return moveQueryParams(pathSoFar);
	}

	let option = args[0];

	// if the option starts with a "/" return it as is
	if (option.startsWith('/')) {
		return getLink(args.slice(1), configCopy, pathSoFar + option);
	}

	// try to fix potential typos
	if (!configCopy[option]) {
		const validOptions = Object.keys(configCopy).filter(
			(key) => !reservedKeys.includes(key)
		);

		option =
			getClosest(option, validOptions, option.length > 3 ? 2 : 1) || option;
	}

	// the first option should exist in the config
	if (!configCopy[option] && pathSoFar === '') {
		throw new Error(`Option "${option}" doesn't exist`);
	}

	let aliasedOption = configCopy[option]?._alias;
	while (aliasedOption) {
		if (!configCopy[aliasedOption]) {
			throw new Error(
				`Option "${aliasedOption}" cannot be aliased because it doesn't exist`
			);
		}

		option = aliasedOption;

		aliasedOption = configCopy[option]?._alias;
	}

	let extendedOption = configCopy[option]?._extend;
	while (extendedOption) {
		if (!configCopy[extendedOption]) {
			throw new Error(
				`Option "${extendedOption}" is not extendable because it doesn't exist`
			);
		}

		if (!configCopy[extendedOption]._path) {
			throw new Error(
				`Option "${extendedOption}" is not extendable because it is a string`
			);
		}

		delete configCopy[option]._extend;

		configCopy[option] = {
			...configCopy[extendedOption],
			...configCopy[option],
		};

		extendedOption = configCopy[option]?._extend;
	}

	if (!configCopy[option]) {
		return getLink(args.slice(1), configCopy, pathSoFar);
	}

	const value = configCopy[option]._path || configCopy[option];

	if (args.length === 1) {
		return moveQueryParams(removeExtraSlashes(pathSoFar + value));
	}

	return getLink(args.slice(1), configCopy[option], pathSoFar + value);
};

function moveQueryParams(path) {
	const [, queryParams] = path.match(/(\?.*)(?:\/)(?:.+$)/) || [];

	if (queryParams) {
		path = path.replace(queryParams, '') + queryParams;
	}

	return path;
}

function removeExtraSlashes(path) {
	return path.replace(/(?<!(http:|https:))\/\//g, '/');
}
