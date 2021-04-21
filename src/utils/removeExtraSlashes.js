module.exports = function removeExtraSlashes(path) {
	return path.replace(/(?<!(http:|https:))\/+/g, '/');
};
