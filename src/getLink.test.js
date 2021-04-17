const getLink = require('./getLink');

test('Supports options with string values', () => {
	const config = {
		a: 'https://a.com',
	};
	expect(getLink(['a'], config)).toBe('https://a.com');
});

test('Supports options with object values', () => {
	const config = {
		a: {
			_path: 'https://a.com',
		},
	};
	expect(getLink(['a'], config)).toBe('https://a.com');
});

test('Supports chaining object->string', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			b: '/b',
		},
	};
	expect(getLink(['a', 'b'], config)).toBe('https://a.com/b');
});

test('Supports chaining object->object', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			b: {
				_path: '/b',
			},
		},
	};
	expect(getLink(['a', 'b'], config)).toBe('https://a.com/b');
});

test('Treats options starting with "/" as strings', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			b: '/b',
		},
	};
	expect(getLink(['a', '/foo'], config)).toBe('https://a.com/foo');
	expect(getLink(['a', 'b', '/foo'], config)).toBe('https://a.com/b/foo');
	expect(getLink(['a', '/foo', 'b'], config)).toBe('https://a.com/foo/b');
});

test('Moves query params at the end of the url', () => {
	const config = {
		a: {
			_path: 'https://a.com?foo=bar',
			b: '/b',
		},
	};
	expect(getLink(['a', 'b'], config)).toBe('https://a.com/b?foo=bar');
});

test('Supports _alias on string values', () => {
	const config = {
		a: 'https://a.com',
		b: {
			_alias: 'a',
		},
	};
	expect(getLink(['b'], config)).toBe('https://a.com');
});

test('Supports _alias on object values', () => {
	const config = {
		a: {
			_path: 'https://a.com',
		},
		b: {
			_alias: 'a',
		},
	};
	expect(getLink(['b'], config)).toBe('https://a.com');
});

test('Supports chaining object->string after resolving _alias', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			c: '/c',
		},
		b: {
			_alias: 'a',
		},
	};
	expect(getLink(['b', 'c'], config)).toBe('https://a.com/c');
});

test('Resolves all available _alias options', () => {
	const config = {
		github: {
			_path: 'https://github.com',
			pulls: '/pulls',
			pull: {
				_alias: 'pulls',
			},
			pr: {
				_alias: 'pull',
			},
			p: {
				_alias: 'pr',
			},
		},
	};
	expect(getLink(['github', 'p'], config)).toBe('https://github.com/pulls');
});

test('Supports chaining object->object after resolving _alias', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			c: {
				_path: '/c',
			},
		},
		b: {
			_alias: 'a',
		},
	};
	expect(getLink(['b', 'c'], config)).toBe('https://a.com/c');
});

test('Supports _extend', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			c: '/c',
			d: {
				_path: '/d',
			},
		},
		b: {
			_path: 'https://b.com',
			_extend: 'a',
		},
	};
	expect(getLink(['b', 'c'], config)).toBe('https://b.com/c');
	expect(getLink(['b', 'd'], config)).toBe('https://b.com/d');
});

test('Retains new options with _extend', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			c: '/c',
		},
		b: {
			_path: 'https://b.com',
			_extend: 'a',
			d: {
				_path: '/d',
				e: '/e',
			},
		},
	};
	expect(getLink(['b', 'd', 'e'], config)).toBe('https://b.com/d/e');
});

test('Overwrites existing options with _extend', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			c: '/c',
		},
		b: {
			_path: 'https://b.com',
			_extend: 'a',
			c: {
				_path: '/d',
				e: '/e',
			},
		},
	};
	expect(getLink(['b', 'c', 'e'], config)).toBe('https://b.com/d/e');
});

test('Resolves all available _extend options', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			c: '/c',
			foo: {
				_path: '/foo',
				bar: '/bar',
			},
		},
		b: {
			_path: 'https://b.com',
			_extend: 'a',
			d: '/d',
		},
		e: {
			_path: 'https://e.com',
			_extend: 'b',
			f: '/f',
		},
		g: {
			_path: 'https://g.com',
			_extend: 'e',
			h: '/h',
		},
	};
	expect(getLink(['e', 'd'], config)).toBe('https://e.com/d');
	expect(getLink(['e', 'c'], config)).toBe('https://e.com/c');
	expect(getLink(['g', 'c'], config)).toBe('https://g.com/c');
	expect(getLink(['g', 'd'], config)).toBe('https://g.com/d');
	expect(getLink(['g', 'h'], config)).toBe('https://g.com/h');
	expect(getLink(['g', 'foo', 'bar'], config)).toBe('https://g.com/foo/bar');
});

test('Supports _alias after _extend', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			c: {
				_path: '/c',
				e: '/e',
			},
			d: {
				_alias: 'c',
			},
		},
		b: {
			_path: 'https://b.com',
			_extend: 'a',
		},
	};
	expect(getLink(['b', 'd', 'e'], config)).toBe('https://b.com/c/e');
});

test('Supports _extend after _alias', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			c: {
				_path: '/c',
				e: '/e',
			},
		},
		b: {
			_path: 'https://b.com',
			_extend: 'a',
		},
		d: {
			_alias: 'b',
		},
	};
	expect(getLink(['d', 'c', 'e'], config)).toBe('https://b.com/c/e');
});

test('Throws an error when _extend references a string option', () => {
	const config = {
		a: 'https://a.com',
		b: {
			_path: 'https://b.com',
			_extend: 'a',
		},
	};
	expect(() => getLink(['b'], config)).toThrowError(
		/^Option "a" is not extendable because it is a string$/
	);
});

test('Throws an error when _extend references a non-existent option', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			_extend: 'foo',
		},
	};
	expect(() => getLink(['a'], config)).toThrowError(
		/^Option "foo" is not extendable because it doesn't exist$/
	);
});

test('Throws an error when _alias references a non-existent option', () => {
	const config = {
		a: {
			_alias: 'foo',
		},
		b: {
			_path: 'http://b.com',
			c: {
				_alias: 'foo',
			},
		},
	};
	expect(() => getLink(['a'], config)).toThrowError(
		/^Option "foo" cannot be aliased because it doesn't exist$/
	);
	expect(() => getLink(['b', 'c'], config)).toThrowError(
		/^Option "foo" cannot be aliased because it doesn't exist$/
	);
});

test("Throws an error when when the first option doesn't exist", () => {
	const config = {
		a: 'https://a.com',
	};
	expect(() => getLink(['foo', 'a'], config)).toThrowError(
		/^Option "foo" doesn't exist$/
	);
});

test('Ignores non-existent options that are not in the start of the path', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			b: '/b',
		},
	};
	expect(getLink(['a', 'b', 'foo', 'bar'], config)).toBe('https://a.com/b');
});
