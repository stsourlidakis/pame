# pame

[![version](https://img.shields.io/npm/v/pame?style=flat)](https://www.npmjs.com/package/pame)
[![license](https://img.shields.io/npm/l/pame)](https://github.com/stsourlidakis/pame/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/stsourlidakis/pame/branch/master/graph/badge.svg)](https://codecov.io/gh/stsourlidakis/pame)
[![changelog](https://shields.io/badge/-Changelog-informational)](CHANGELOG.md)

**Construct** and **open** links in your **browser** from the comfort of your terminal.

> Pronounced **_páme_** like the greek word **_πάμε_**, meaning **_Let's go!_**

## Do I need this?

If you tick some of the boxes below, `pame` will probably save you some time

- You spend time in your terminal
- You often need to open the same or slightly different urls (aws/gcp pages, dashboards, documentation, repositories etc)
- You don't like reaching for your mouse so you can search in bookmarks/open tabs
- You like configuring shortcuts/aliases

## Installation

```sh
npm i pame -g
```

## Quick Overview

You can create a JSON config with pages you want to open with `pame`.

![Overview config](./media/overview-config.png) ![Overview terminal](./media/overview-terminal.png)

<details>
  <summary>Show quick overview code</summary>

```json
// ~/.pame.config.json
{
	"github": {
		"_path": "https://github.com",
		"pr": "/pulls"
	},
	"gh": {
		"_alias": "github"
	},
	"reddit": "https://reddit.com/r",
	"npm": "https://www.npmjs.com/search?q={*}"
}
```

```sh
pame github
# Opens https://github.com

pame github pr
# Opens https://github.com/pulls

pame gh
# Opens https://github.com

pame gh pr
# Opens https://github.com/pulls

pame reddit /news
# Opens https://reddit.com/r/news

pame npm testing
# Opens https://www.npmjs.com/search?q=testing
```

</details>

## Main features ✨

- [Sub-pages](#url-nesting)
- [Query params placeholders](#query-params-placeholders)
- [Typo tolerance](#typo-tolerance)
- [Dynamic sub-pages](#dynamic-sub-paths)
- [Flexible query string](#query-string)
- [Aliases](#aliases)
- [Extension of existing pages](#extending-configurations)

## Configuration

Most of the functionality comes from your config's structure and not CLI options/flags.

By default, all the configuration is done in a file called `.pame.config.json` in your home directory (e.g. `/home/user/.pame.config.json` ).

You can override the default config path by setting the `PAME_CONFIG` environment variable.

e.g.

```sh
PAME_CONFIG="/some/path/pame.json"
```

You can view the config's path and open\* your config with `pame --config`

> \*The `EDITOR` environment variable should be set in order to open the file.

### Simple url

You can define simple urls as strings or objects

```json
{
	"github": "https://github.com"
}
```

Or

```json
{
	"github": {
		"_path": "https://github.com"
	}
}
```

```sh
pame github
# Opens https://github.com in a new browser tab
```

### Url nesting

You can add sub-paths to your urls

```json
{
	"github": {
		"_path": "https://github.com",
		"pulls": "/pulls"
	}
}
```

```sh
pame github pulls
# Opens https://github.com/pulls
```

Nesting doesn't have a depth limit

```json
{
	"github": {
		"_path": "https://github.com",
		"pulls": {
			"_path": "/pulls",
			"m": "/mentioned",
			"a": "/assigned"
		}
	}
}
```

```sh
pame github pulls m
# Opens https://github.com/pulls/mentioned

pame github pulls a
# Opens https://github.com/pulls/assigned
```

### Query Params placeholders

Query params can have placeholder values which can be replaced when constructing the url by starting an argument with a `*` or by providing a string that doesn't match any sub-path.

- simple placeholder: `?lang={*}`
- with default value: `?lang={*en}`

Unused placeholders with no default value will be removed from the final url.

```json
{
	"npm": "https://www.npmjs.com/search?q={*}",
	"translate": "https://translate.google.com/?text={*}&sl={*en}&tl={*el}"
}
```

The following examples will also work without starting the arguments with a `*` since they do not match any sub-paths.

```sh
pame npm *testing
# OR
pame npm testing
# Opens https://www.npmjs.com/search?q=testing

pame translate *hello
# Opens https://translate.google.com/?text=hello&sl=en&tl=el

pame translate *hola *es *en
# Opens https://translate.google.com/?text=hola&sl=es&tl=en

pame translate *"hello there"
# Opens https://translate.google.com/?text=hello%20there&sl=en&tl=el

pame translate
# Opens https://translate.google.com/?sl=en&tl=el
```

### Aliases

You can create **same level** aliases by using `_alias`, nested paths and other features will still work!

```json
{
	"github": {
		"_path": "https://github.com",
		"pulls": "/pulls"
	},
	"gh": {
		"_alias": "github"
	}
}
```

```sh
pame gh
# Opens https://github.com

pame gh pulls
# Opens https://github.com/pulls
```

You can have multiple and/or nested aliases.

```json
{
	"github": {
		"_path": "https://github.com",
		"pulls": "/pulls",
		"pr": {
			"_alias": "pulls"
		},
		"p": {
			"_alias": "pulls"
		}
	},
	"gh": {
		"_alias": "github"
	}
}
```

```sh
pame github pr
# Opens https://github.com/pulls

pame github p
# Opens https://github.com/pulls

pame gh p
# Opens https://github.com/pulls
```

### Extending configurations

Url configs can inherit sub-pages with `_extend`.

```json
{
	"ddg": {
		"_path": "https://duckduckgo.com",
		"i": "/images"
	},
	"google": {
		"_path": "https://google.com",
		"_extend": "ddg",
		"m": "/maps"
	}
}
```

```sh
pame google
# Opens https://google.com

pame google i
# Opens https://google.com/images

pame google m
# Opens https://google.com/maps
```

## Other features

### Typo tolerance

If your input doesn't match your config 100% `pame` will try the following in order to find a match:

- Trim your input
- Ignore case
- [Deburr](https://lodash.com/docs/4.17.15#deburr) strings
- Find matches with a [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) of 1 or 2 (depending on the input's length)

```json
{
	"github": "https://github.com"
}
```

```sh
pame gthub
# Opens https://github.com

pame gITHUB
# Opens https://github.com
```

All arguments except the first one will be ignored if they can't be matched and they can't be used as a [query param placeholde](#query-params-placeholders) value.

```json
{
	"github": {
		"_path": "https://github.com",
		"pr": "/pulls"
	}
}
```

```sh
pame github foo pr
# Opens https://github.com/pulls
```

### Dynamic sub-paths

You can append to the end of your url by starting an argument with a slash (`/`)

```json
{
	"reddit": "https://reddit.com/r"
}
```

```sh
pame reddit /news
# Opens https://reddit.com/r/news

pame reddit /gifs
# Opens https://reddit.com/r/gifs
```

### Query string

A query string found on any level will be moved to the end of the final url

```json
{
	"foo": {
		"_path": "https://foo.com?lang=en",
		"bar": "/bar"
	}
}
```

```sh
pame foo
# Opens https://foo.com?lang=en

pame foo bar
# Opens https://foo.com/bar?lang=en
```

## Options

`--config`

Prints the config path and opens the file if the `EDITOR` environment variable is set

`--config-show`

Prints you config

`--dry-run`

Prints the constructed url instead of printing and then opening in the browser.
