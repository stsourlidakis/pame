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
			b: {
				_path: '/b',
				c: '/c',
			},
		},
	};

	expect(getLink(['a', 'b', '/c'], config)).toBe('https://a.com/b/c?foo=bar');
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

test('Supports deep level _extend', () => {
	const config = {
		a: {
			_path: 'https://a.com',
			b: {
				_path: '/b',
				c: '/c',
			},
			d: {
				_path: '/d',
				_extend: 'b',
			},
		},
	};

	expect(getLink(['a', 'd', 'c'], config)).toBe('https://a.com/d/c');
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

test("Throws an error when when the first option can't be matched", () => {
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

test('Fixes minor typos in options', () => {
	const config = {
		github: {
			_path: 'https://github.com',
			pr: '/pulls',
		},
	};
	expect(getLink(['githubb', 'pr'], config)).toBe('https://github.com/pulls');
	expect(getLink(['ghub', 'p'], config)).toBe('https://github.com/pulls');
});

test('Fixes case in options', () => {
	const config = {
		github: {
			_path: 'https://github.com',
			pr: '/pulls',
		},
	};
	expect(getLink(['GITHUB', 'pr'], config)).toBe('https://github.com/pulls');
});

test('Trims options', () => {
	const config = {
		github: {
			_path: 'https://github.com',
			pr: '/pulls',
		},
	};
	expect(getLink(['  github    ', 'pr'], config)).toBe(
		'https://github.com/pulls'
	);
});

test('Removes extra slashes (/)', () => {
	const config = {
		github: {
			_path: 'https://github.com/',
			pr: '/pulls',
		},
	};
	expect(getLink(['github', 'pr'], config)).toBe('https://github.com/pulls');
});

test('Encodes final URL', () => {
	const config = {
		a: 'https://a.com/?a=b c&pame=πάμε',
	};
	expect(getLink(['a'], config)).toBe(
		encodeURI('https://a.com/?a=b c&pame=πάμε')
	);
});

describe('Query params placeholders', () => {
	test('Replaces query params placeholders with the provided value', () => {
		const config = {
			a: 'https://a.com/?b={*}',
		};
		expect(getLink(['a', '*c'], config)).toBe('https://a.com/?b=c');
	});

	test('Replaces query params placeholders with the provided value on nested paths', () => {
		const config = {
			a: {
				_path: 'https://a.com',
				b: '/b?c={*}',
			},
		};
		expect(getLink(['a', 'b', '*d'], config)).toBe('https://a.com/b?c=d');
	});

	test('Replaces query params placeholders with their default value', () => {
		const config = {
			a: 'https://a.com/?b={*c}',
		};
		expect(getLink(['a'], config)).toBe('https://a.com/?b=c');
	});

	test('Removes unused query params placeholders', () => {
		const config = {
			a: 'https://a.com/?b={*}',
		};
		expect(getLink(['a'], config)).toBe('https://a.com/');
	});

	test('Uses unmatched options as query params placeholder values if possible', () => {
		const config = {
			a: 'https://a.com/?b={*}',
		};
		expect(getLink(['a', 'c'], config)).toBe('https://a.com/?b=c');
	});
});

describe('README examples', () => {
	test('Quick Overview', () => {
		const config = {
			npm: 'https://npmjs.com',
			github: {
				_path: 'https://github.com',
				pr: '/pulls',
			},
			gh: {
				_alias: 'github',
			},
			reddit: 'https://reddit.com/r',
		};
		expect(getLink(['npm'], config)).toBe('https://npmjs.com');
		expect(getLink(['github'], config)).toBe('https://github.com');
		expect(getLink(['github', 'pr'], config)).toBe('https://github.com/pulls');
		expect(getLink(['gh'], config)).toBe('https://github.com');
		expect(getLink(['gh', 'pr'], config)).toBe('https://github.com/pulls');
		expect(getLink(['reddit', '/news'], config)).toBe(
			'https://reddit.com/r/news'
		);
	});

	test('Simple url - string', () => {
		const config = { github: 'https://github.com' };
		expect(getLink(['github'], config)).toBe('https://github.com');
	});

	test('Simple url - object', () => {
		const config = {
			github: {
				_path: 'https://github.com',
			},
		};
		expect(getLink(['github'], config)).toBe('https://github.com');
	});

	test('Url nesting', () => {
		const config = {
			github: {
				_path: 'https://github.com',
				pulls: '/pulls',
			},
		};
		expect(getLink(['github', 'pulls'], config)).toBe('https://github.com/pulls');
	});

	test('Url deep nesting', () => {
		const config = {
			github: {
				_path: 'https://github.com',
				pulls: {
					_path: '/pulls',
					m: '/mentioned',
					a: '/assigned',
				},
			},
		};

		expect(getLink(['github', 'pulls', 'm'], config)).toBe(
			'https://github.com/pulls/mentioned'
		);

		expect(getLink(['github', 'pulls', 'a'], config)).toBe(
			'https://github.com/pulls/assigned'
		);
	});

	test('Alias', () => {
		const config = {
			github: {
				_path: 'https://github.com',
				pulls: '/pulls',
			},
			gh: {
				_alias: 'github',
			},
		};

		expect(getLink(['gh'], config)).toBe('https://github.com');

		expect(getLink(['gh', 'pulls'], config)).toBe('https://github.com/pulls');
	});

	test('Alias - multiple/nested', () => {
		const config = {
			github: {
				_path: 'https://github.com',
				pulls: '/pulls',
				pr: {
					_alias: 'pulls',
				},
				p: {
					_alias: 'pulls',
				},
			},
			gh: {
				_alias: 'github',
			},
		};

		expect(getLink(['github', 'pr'], config)).toBe('https://github.com/pulls');

		expect(getLink(['github', 'p'], config)).toBe('https://github.com/pulls');

		expect(getLink(['gh', 'p'], config)).toBe('https://github.com/pulls');
	});

	test('Extend', () => {
		const config = {
			ddg: {
				_path: 'https://duckduckgo.com',
				i: '/images',
			},
			google: {
				_path: 'https://google.com',
				_extend: 'ddg',
				m: '/maps',
			},
		};

		expect(getLink(['google'], config)).toBe('https://google.com');

		expect(getLink(['google', 'i'], config)).toBe('https://google.com/images');

		expect(getLink(['google', 'm'], config)).toBe('https://google.com/maps');
	});

	test('Dynamic sub-path', () => {
		const config = { reddit: 'https://reddit.com/r' };

		expect(getLink(['reddit', '/news'], config)).toBe(
			'https://reddit.com/r/news'
		);

		expect(getLink(['reddit', '/gifs'], config)).toBe(
			'https://reddit.com/r/gifs'
		);
	});

	test('Query string', () => {
		const config = {
			foo: {
				_path: 'https://foo.com?lang=en',
				bar: '/bar',
			},
		};

		expect(getLink(['foo'], config)).toBe('https://foo.com?lang=en');

		expect(getLink(['foo', 'bar'], config)).toBe('https://foo.com/bar?lang=en');
	});

	test('Typo tolerance', () => {
		const config = {
			github: 'https://github.com',
		};

		expect(getLink(['gthub'], config)).toBe('https://github.com');

		expect(getLink(['gITHUB'], config)).toBe('https://github.com');
	});

	test('Ignored unmatched options', () => {
		const config = {
			github: {
				_path: 'https://github.com',
				pr: '/pulls',
			},
		};

		expect(getLink(['github', 'foo', 'pr'], config)).toBe(
			'https://github.com/pulls'
		);
	});

	test('Query params placeholders', () => {
		const config = {
			npm: 'https://www.npmjs.com/search?q={*}',
			translate: 'https://translate.google.com/?text={*}&sl={*en}&tl={*el}',
		};

		expect(getLink(['npm', '*testing'], config)).toBe(
			'https://www.npmjs.com/search?q=testing'
		);

		expect(getLink(['npm', 'testing'], config)).toBe(
			getLink(['npm', '*testing'], config)
		);

		expect(getLink(['translate', '*hola', '*es', '*en'], config)).toBe(
			'https://translate.google.com/?text=hola&sl=es&tl=en'
		);

		expect(getLink(['translate', '*hello'], config)).toBe(
			'https://translate.google.com/?text=hello&sl=en&tl=el'
		);

		expect(getLink(['translate', '*hello there'], config)).toBe(
			'https://translate.google.com/?text=hello%20there&sl=en&tl=el'
		);

		expect(getLink(['translate'], config)).toBe(
			'https://translate.google.com/?sl=en&tl=el'
		);
	});
});
