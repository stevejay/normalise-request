# normalise-request

Normalises API requests

[![npm version](https://badge.fury.io/js/normalise-request.svg)](https://badge.fury.io/js/normalise-request)
[![Codeship Status for stevejay/normalise-request](https://app.codeship.com/projects/4fd232b0-a545-0134-c5f3-66ecd8905c85/status?branch=master)](https://app.codeship.com/projects/190828)
[![Coverage Status](https://coveralls.io/repos/github/stevejay/normalise-request/badge.svg?branch=master)](https://coveralls.io/github/stevejay/normalise-request?branch=master)
[![dependency status](https://david-dm.org/stevejay/normalise-request.svg)](https://david-dm.org/stevejay/normalise-request)

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
            secondLine: { trim: true },
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

### Available Normalisers

TODO

## License

MIT

## Acknowledgements

This package was influenced by the package [Validate.js](https://validatejs.org/).
