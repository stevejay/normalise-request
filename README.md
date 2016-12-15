# normalise-request

Normalises API requests

[![npm version](https://badge.fury.io/js/normalise-request.svg)](https://badge.fury.io/js/normalise-request)
[![Coverage Status](https://coveralls.io/repos/github/stevejay/normalise-request/badge.svg?branch=master)](https://coveralls.io/github/stevejay/normalise-request?branch=master)
[![dependency status](https://david-dm.org/stevejay/normalise-request.svg)](https://david-dm.org/stevejay/normalise-request)

## Install

```
$ npm install --save normalise-request
```

## Usage

```js
const normalise = require('normalise-request');

const normaliser = {
    name: {
        trim: true
    }
};

const request = {
    name: '   foo   '
};

normalise(request, normaliser);

// request.name is now 'foo'
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

## License

MIT

## Acknowledgements

This package was influenced by the package [Validate.js](https://validatejs.org/).
