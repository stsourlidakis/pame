const replace = require('./replacePlaceholderQueryParam');

test('Throws an error when the place holder value is empty', () => {
	expect(() => replace('https://foo.com?a={*}')).toThrowError(
		/^The placeholder value cannot be empty$/
	);
});

describe('Replaces the first available placeholder query param', () => {
	test('When there are no other params', () => {
		expect(replace('https://foo.com?a={*}', 'b')).toBe('https://foo.com?a=b');
	});

	test('At the start of the query string', () => {
		expect(replace('https://foo.com?a={*}&c=5', 'b')).toBe(
			'https://foo.com?a=b&c=5'
		);
	});

	test('At the end of the query string', () => {
		expect(replace('https://foo.com?a=b&c={*}', 'd')).toBe(
			'https://foo.com?a=b&c=d'
		);
	});

	test('At the middle of the query string', () => {
		expect(replace('https://foo.com?a=b&c={*}&e=123', 'd')).toBe(
			'https://foo.com?a=b&c=d&e=123'
		);
	});

	test('Without affecting other placeholders', () => {
		expect(replace('https://foo.com?a=b&c={*}&e=123&f={*}', 'd')).toBe(
			'https://foo.com?a=b&c=d&e=123&f={*}'
		);
	});

	test('When there is a default value', () => {
		expect(replace('https://foo.com?a={*c}', 'b')).toBe('https://foo.com?a=b');
	});

	test('When there is an anchor', () => {
		expect(replace('https://foo.com?a={*}#bar', 'b')).toBe(
			'https://foo.com?a=b#bar'
		);
	});
});

describe('Has no side-effects', () => {
	test('Does nothing when there are no query params', () => {
		expect(replace('https://foo.com', 'foo')).toBe('https://foo.com');

		expect(replace('https://foo.com?', 'foo')).toBe('https://foo.com?');

		expect(replace('https://foo.com#bar', 'foo')).toBe('https://foo.com#bar');
	});

	test('Does nothing when there are no placeholder query params', () => {
		expect(replace('https://foo.com?a=b', 'foo')).toBe('https://foo.com?a=b');

		expect(replace('https://foo.com?v', 'foo')).toBe('https://foo.com?v');
	});
});
