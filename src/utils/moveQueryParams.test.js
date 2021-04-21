const moveQueryParams = require('./moveQueryParams');

test('Moves the query params to the end of the url', () => {
	expect(moveQueryParams('https://foo.com?a=1&b=2/bar/baz')).toBe(
		'https://foo.com/bar/baz?a=1&b=2'
	);
});

test("Doesn't change the url if the query params are already in the end", () => {
	expect(moveQueryParams('https://foo.com/bar?a=1&b=2')).toBe(
		'https://foo.com/bar?a=1&b=2'
	);
});

test("Doesn't change the url if there are no query params", () => {
	expect(moveQueryParams('https://foo.com/bar')).toBe('https://foo.com/bar');
});
