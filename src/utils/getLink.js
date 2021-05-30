const v8 = require('v8');
const getClosest = require('./getClosest');
const moveQueryParams = require('./moveQueryParams');
const removeExtraSlashes = require('./removeExtraSlashes');
const replacePlaceholderQueryParam = require('./replacePlaceholderQueryParam');
const handleUnusedQueryParamPlaceholders = require('./handleUnusedQueryParamPlaceholders');
const { reservedKeys } = require('../constants');

module.exports = function getLink(args, config, pathSoFar = '') {
	const configCopy = v8.deserialize(v8.serialize(config));

	// if there are no args, return
	if (args.length === 0) {
		return normalizeLink(pathSoFar);
	}

	let option = args[0];

	// if the option starts with a "/" return it as is
	if (option.startsWith('/')) {
		return getLink(args.slice(1), configCopy, pathSoFar + option);
	}

	// if the option starts with a "*" use it in the next query param placeholder
	if (option.startsWith('*')) {
		return getLink(
			args.slice(1),
			configCopy,
			replacePlaceholderQueryParam(pathSoFar, option.slice(1))
		);
	}

	// try to fix potential typos
	if (!configCopy[option] && typeof configCopy === 'object') {
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

	// if the option can't be matched with anything use it as query param placeholder value
	if (!configCopy[option]) {
		return getLink(
			args.slice(1),
			configCopy,
			replacePlaceholderQueryParam(pathSoFar, option)
		);
	}

	const value = configCopy[option]._path || configCopy[option];

	if (args.length === 1) {
		return normalizeLink(pathSoFar + value);
	}

	return getLink(args.slice(1), configCopy[option], pathSoFar + value);
};

function normalizeLink(link) {
	// Order matters
	const funcs = [
		removeExtraSlashes,
		moveQueryParams,
		handleUnusedQueryParamPlaceholders,
		encodeURI,
	];

	return funcs.reduce((updatedLink, func) => func(updatedLink), link);
}
