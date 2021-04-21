const getClosest = require('./getClosest');

test('Returns valid results', () => {
	const options = ['foo', 'bar'];

	expect(getClosest('ar', options, 1)).toBe('bar');
	expect(getClosest('car', options, 1)).toBe('bar');
	expect(getClosest('foo', options)).toBe('foo');
});

test('Returns null if no match is found', () => {
	const options = ['foo', 'bar'];

	expect(getClosest('zzzz', options)).toBe(null);
});

test('Has a default max distance of 1', () => {
	const options = ['foo', 'bar'];

	expect(getClosest('baz', options)).toBe('bar');
});

test('Uses the provided max distance', () => {
	const options = ['foo', 'baar'];

	expect(getClosest('baz', options, 2)).toBe('baar');
	expect(getClosest('zzzo', options, 3)).toBe('foo');
	expect(getClosest('zoo', options, Infinity)).toBe('foo');
});
