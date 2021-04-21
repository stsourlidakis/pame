const removeExtraSlashes = require('./removeExtraSlashes');

test('Removes extra slashes', () => {
	expect(removeExtraSlashes('https://foo.com//bar')).toBe('https://foo.com/bar');
});

test('Removes multiple extra slashes', () => {
	expect(removeExtraSlashes('https://foo.com//bar//baz')).toBe(
		'https://foo.com/bar/baz'
	);
});

test('Removes multiple sequential extra slashes', () => {
	expect(removeExtraSlashes('https://foo.com///bar////////baz')).toBe(
		'https://foo.com/bar/baz'
	);
});

test("Doesn't change the url if there are no extra slashes", () => {
	expect(removeExtraSlashes('http://foo.com/bar')).toBe('http://foo.com/bar');
	expect(removeExtraSlashes('https://foo.com/bar')).toBe('https://foo.com/bar');
});
