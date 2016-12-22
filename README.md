# normalise-request

Normalises API requests

[![npm version](https://badge.fury.io/js/normalise-request.svg)](https://badge.fury.io/js/normalise-request)
[![Codeship Status for stevejay/normalise-request](https://app.codeship.com/projects/4fd232b0-a545-0134-c5f3-66ecd8905c85/status?branch=master)](https://app.codeship.com/projects/190828)
[![Coverage Status](https://coveralls.io/repos/github/stevejay/normalise-request/badge.svg?branch=master)](https://coveralls.io/github/stevejay/normalise-request?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/stevejay/normalise-request/badges/score.svg)](https://www.bithound.io/github/stevejay/normalise-request)
[![bitHound Dependencies](https://www.bithound.io/github/stevejay/normalise-request/badges/dependencies.svg)](https://www.bithound.io/github/stevejay/normalise-request/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/stevejay/normalise-request/badges/devDependencies.svg)](https://www.bithound.io/github/stevejay/normalise-request/master/dependencies/npm)
![license](https://img.shields.io/npm/l/normalise-request.svg)

[![NPM](https://nodei.co/npm/normalise-request.png)](https://nodei.co/npm/normalise-request/)

## Install

```
$ npm install --save normalise-request
```

## Usage

### Simple Objects

The most basic usage is normalising a simple object:

```js
const normalise = require('normalise-request');

const request = {
    name: '   Steve   ',
    address: '  The Locksfords   '
};

const normaliser = {
    name: {
        trim: true
    },
    address: {
        trim: true
    }
};

normalise(request, normaliser);

// request.name is now 'Steve'
// request.address is now 'The Locksfords'
```

### Nested Objects

```js
const normalise = require('normalise-request');

const request = {
    name: '   Steve   ',
    address: {
        firstLine: '  The Locksfords  ',
        secondLine: ' London '
    }
};

const normaliser = {
    name: {
        trim: true
    },
    address: {
        object: {
            firstLine: { trim: true },
            secondLine: { trim: true }
        }
    }
};

normalise(request, normaliser);

// request.name is now 'Steve'
// request.address.firstLine is now 'The Locksfords'
// request.address.secondLine is now 'London'
```

### Arrays of Primitive Types

```js
const normalise = require('normalise-request');

const request = {
    tags: ['  art  ', '   theatre   ']
};

const normaliser = {
    tags: {
        each: {
            trim: true
        }
    }
};

normalise(request, normaliser);

// request.tags[0] is now 'art'
// request.tags[1] is now 'theatre'
```

### Arrays of Objects

```js
const normalise = require('normalise-request');

const request = {
    tags: [
        { label: '  art  ' },
        { label: '   theatre   '}
    ]
};

const normaliser = {
    tags: {
        each: {
            object: {
                label: {
                    trim: true
                }
            }
        }
    }
};

normalise(request, normaliser);

// request.tags[0].label is now 'art'
// request.tags[1].label is now 'theatre'
```

## API

### normalise(object, normaliser)

Mutates `object` to normalise it according to the `normaliser`.

#### object

Type: `Object`

The object to normalise.

#### normaliser

Type: `Object`

The normaliser object that specifies the normalisations to apply to the object.

### Normalisers

#### trim

Trims the value to normalise if it is a string.

```js
const normaliser = {
    name: {
        trim: true
    }
};
```

#### toUpperCase

Uppercases the value to normalise if it is a string.

```js
const normaliser = {
    name: {
        toUpperCase: true
    }
};
```

#### toLowerCase

Lowercases the value to normalise if it is a string.

```js
const normaliser = {
    name: {
        toLowerCase: true
    }
};
```

#### undefinedIfEmpty

Sets the value to normalise to `undefined` if it is a zero-length string or
a zero-length array, or if the value is `null`.

```js
const normaliser = {
    name: {
        undefinedIfEmpty: true
    }
};
```

#### collapseWhitespace

Collapses whitespace in the value to normalise if it is a string.
Any runs of multiple whitespace characters are each 
replaced by a single space character. If using this normaliser
on a value, you would normally also use the `trim` normaliser.

```js
const normaliser = {
    name: {
        toLowerCase: true
    }
};
```

#### replace

Replaces matching strings in the value to normalise, if that 
value is a string. This normaliser uses the `String.replace`
method to do the replacement, so the arguments to this 
normaliser and its behaviour correspond to those of that string method:

- `pattern` can be a string or a regex 
- `newSubStr` is the replacement string

```js
const normaliser = {
    name: {
        replace: { pattern: /H/g, newSubStr: 'Y'}
    }
};
```

#### toFloat

Converts the value to normalise to a float number, if that value is a string.

```js
const normaliser = {
    name: {
        toFloat: true
    }
};
```

#### toInt

Converts the value to normalise to an integer number, if that value is a string.

```js
const normaliser = {
    name: {
        toInt: true
    }
};
```

#### default

Sets the value to normalise to a replacement value, if that value to 
normalise is `null` or `undefined`.

```js
const normaliser = {
    name: {
        default: 'my default value'
    }
};
```

#### decodeAsUriComponent

Converts the value to normalise using the `decodeAsUriComponent` global method,
if that value is a string.

```js
const normaliser = {
    name: {
        toInt: true
    }
};
```

## License

MIT

## Acknowledgements

This package was influenced by the package [Validate.js](https://validatejs.org/).
