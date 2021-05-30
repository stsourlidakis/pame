const splitQueryString = require('./splitQueryString');

test('Throws an error when the provided link is not a string', () => {
	const error = /^The link should be a string$/;

	expect(() => splitQueryString()).toThrowError(error);
	expect(() => splitQueryString(123)).toThrowError(error);
});

test('Splits a link to a url and queryString', () => {
	expect(splitQueryString('https://foo.com?a=1&b=2')).toEqual({
		url: 'https://foo.com',
		queryString: 'a=1&b=2',
	});
});

test("Returns null for parts that don't exist", () => {
	expect(splitQueryString('https://foo.com')).toEqual({
		url: 'https://foo.com',
		queryString: null,
	});

	expect(splitQueryString('https://foo.com?')).toEqual({
		url: 'https://foo.com',
		queryString: null,
	});

	expect(splitQueryString('?a=1&b=2')).toEqual({
		url: null,
		queryString: 'a=1&b=2',
	});

	expect(splitQueryString('')).toEqual({
		url: null,
		queryString: null,
	});
});
