const qs = require('qs');
const splitQueryString = require('./splitQueryString');

module.exports = function handleUnusedQueryParamPlaceholders(url) {
	const { url: urlWithoutQS, queryString } = splitQueryString(url);

	if (!queryString || !queryString.includes('=')) {
		return url;
	}

	const queryStringObj = qs.parse(queryString);

	const placeholderWithoutDefaultValuePattern = new RegExp(/^{\*}$/);

	const cleanedQueryString = qs.stringify(queryStringObj, {
		encode: false,
		indices: false,
		filter: (prefix, value) => {
			if (typeof value !== 'string') {
				return value;
			}

			if (placeholderWithoutDefaultValuePattern.test(value)) {
				// undefined is needed here, other falsy values will not omit the param
				// eslint-disable-next-line no-undefined
				return undefined;
			}

			const [, defaultValue] = value.match(/^{\*(.*?)}$/) || [];

			return defaultValue ? defaultValue : value;
		},
	});

	return [urlWithoutQS, cleanedQueryString].filter(Boolean).join('?');
};
