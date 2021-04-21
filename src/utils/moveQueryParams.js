module.exports = function moveQueryParams(path) {
	const [, queryParams] = path.match(/(\?.*?)(?:\/)/) || [];

	if (queryParams) {
		path = path.replace(queryParams, '') + queryParams;
	}

	return path;
};
