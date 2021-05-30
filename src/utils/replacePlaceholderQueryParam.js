const splitQueryString = require('./splitQueryString');

module.exports = function replacePlaceholderQueryParam(
	url,
	placeholderValue = ''
) {
	if (!placeholderValue) {
		throw new Error(`The placeholder value cannot be empty`);
	}

	const { url: urlWithoutQS, queryString } = splitQueryString(url);

	if (!queryString || !queryString.includes('=')) {
		return url;
	}

	const newQueryString = queryString.replace(/{\*.*?}/, placeholderValue);

	return [urlWithoutQS, newQueryString].filter(Boolean).join('?');
};
