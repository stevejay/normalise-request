'use strict';

const traverseNormaliser = require('./src/traverse-normaliser');
const normalisers = require('./src/normalisers');

function normalise(params, normaliser) {
    traverseNormaliser(params, normaliser);
    return params;
}

normalise.normalisers = normalisers;
module.exports = exports = normalise;
