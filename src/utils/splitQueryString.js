module.exports = function splitQueryString(link) {
	if (typeof link !== 'string') {
		throw new Error(`The link should be a string`);
	}

	const [url, queryString] = link.split(/\?(.*)/);

	return {
		url: url || null,
		queryString: queryString || null,
	};
};
