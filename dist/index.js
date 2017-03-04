'use strict';

var traverseNormaliser = require('./src/traverse-normaliser');
var normalisers = require('./src/normalisers');

function normalise(params, normaliser) {
    traverseNormaliser(params, normaliser);
    return params;
}

normalise.normalisers = normalisers;
module.exports = exports = normalise;