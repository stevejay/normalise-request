# normalise-request

Normalises API requests


[![npm version](https://badge.fury.io/js/normalise-request.svg)](https://badge.fury.io/js/normalise-request)
[![Codeship Status for stevejay/normalise-request](https://app.codeship.com/projects/4fd232b0-a545-0134-c5f3-66ecd8905c85/status?branch=master)](https://app.codeship.com/projects/190828)
[![Coverage Status](https://coveralls.io/repos/github/stevejay/normalise-request/badge.svg?branch=master)](https://coveralls.io/github/stevejay/normalise-request?branch=master)
![license](https://img.shields.io/npm/l/normalise-request.svg)

[![NPM](https://nodei.co/npm/normalise-request.png)](https://nodei.co/npm/normalise-request/)

## Install

```bash
$ npm install --save normalise-request
```

You can include this module using CommonJS format (`require`) or ES6 format (`import`):

```js
const normalise = require('normalise-request');

// or

import normalise from 'normalise-request';
```

The examples in this README file are in CommonJS format.

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

Normalisers are applied in declaration order:

```js
// Example One:

const request = {
    name: '      ',
};

const normaliser = {
    name: {
        trim: true,
        undefinedIfEmpty: true
    }
};

normalise(request, normaliser);

// request.name is now undefined

// Example Two:

const request = {
    name: '      ',
};

const normaliser = {
    name: {
        undefinedIfEmpty: true,
        trim: true
    }
};

normalise(request, normaliser);

// request.name is now '' (the empty string)
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

### Adding a new normaliser

```js
const normalise = require('normalise-request');

const changeToFoo = (param, options) => {
    // param - the value this normaliser is being applied to.
    // options - the object assigned to the normaliser 
    return 'foo';
};

normalise.normalisers.changeToFoo = changeToFoo;

// use it like a built-in normaliser:

const normaliser = {
    name: {
        changeToFoo: { someOption: 'value' }
    }
}

// name will become 'foo'
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
        collapseWhitespace: true
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
        default: { value: 'the default value' }
    }
};

// or

const normaliser = {
    name: {
        default: 'the default value'
    }
};
```

#### decodeAsUriComponent

Converts the value to normalise using the `decodeAsUriComponent` global method,
if that value is a string.

```js
const normaliser = {
    name: {
        decodeAsUriComponent: true
    }
};
```

#### split

Converts the value to normalise using the `string.split` method,
if that value is a string. The argument to the normaliser is the
separator string for the split.

```js
const normaliser = {
    name: {
        split: { separator: ',' }
    }
};

// or 

const normaliser = {
    name: {
        split: ','
    }
};
```

## License

MIT

## Acknowledgements

This package was influenced by the package [Validate.js](https://validatejs.org/).
