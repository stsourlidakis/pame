const handle = require('./handleUnusedQueryParamPlaceholders');

describe('Removes single unused query param', () => {
	test('When there are no other params', () => {
		expect(handle('https://foo.com?a={*}')).toBe('https://foo.com');
	});

	test('From the start of the query string', () => {
		expect(handle('https://foo.com?a={*}&b=a5')).toBe('https://foo.com?b=a5');
	});

	test('From the end of the query string', () => {
		expect(handle('https://foo.com?b=a5&a={*}')).toBe('https://foo.com?b=a5');
	});

	test('From the middle of the query string', () => {
		expect(handle('https://foo.com?a=b&b={*}&c=123')).toBe(
			'https://foo.com?a=b&c=123'
		);
	});
});

describe('Removes multiple unused query params', () => {
	test('When there are no other params', () => {
		expect(handle('https://foo.com?a={*}&b={*}')).toBe('https://foo.com');
	});

	test('From the start of the query string', () => {
		expect(handle('https://foo.com?a={*}&b={*}&c=1')).toBe('https://foo.com?c=1');
	});

	test('From the end of the query string', () => {
		expect(handle('https://foo.com?a=1&b={*}&c={*}')).toBe('https://foo.com?a=1');
	});

	test('From the middle of the query string', () => {
		expect(handle('https://foo.com?a=1&b={*}&c={*}&d=2')).toBe(
			'https://foo.com?a=1&d=2'
		);
	});

	test('From multiple positions of the query string', () => {
		expect(handle('https://foo.com?a=1&b={*}&c=2&d={*}')).toBe(
			'https://foo.com?a=1&c=2'
		);
	});
});

test('Works with arrays', () => {
	expect(handle('https://foo.com?a=1&a={*}')).toBe('https://foo.com?a=1');

	expect(handle('https://foo.com?a[]={*}&a[]={*}')).toBe('https://foo.com');

	expect(handle('https://foo.com?a[0]={*}&a[1]={*}')).toBe('https://foo.com');
});

describe('Fallbacks to the available default value', () => {
	test('For single unused placeholder', () => {
		expect(handle('https://foo.com?a=b&c={*d}')).toBe('https://foo.com?a=b&c=d');
	});

	test('For multiple unused placeholders', () => {
		expect(handle('https://foo.com?a=b&c={*d}&e={*f}')).toBe(
			'https://foo.com?a=b&c=d&e=f'
		);
	});
});

describe('Has no side-effects', () => {
	test('Does nothing when there are no query params', () => {
		expect(handle('https://foo.com')).toBe('https://foo.com');

		expect(handle('https://foo.com?')).toBe('https://foo.com?');
	});

	test('Does nothing when there are no unused query params', () => {
		expect(handle('https://foo.com?a=b&c=d e')).toBe('https://foo.com?a=b&c=d e');

		expect(handle('https://foo.com?v')).toBe('https://foo.com?v');
	});

	test('Does nothing to empty query params', () => {
		expect(handle('https://foo.com?a=b&c={*}&d=')).toBe('https://foo.com?a=b&d=');
	});
});
