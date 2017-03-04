'use strict';

var normalisers = require('./normalisers');

var EACH_NORMALISER_NAME = 'each';
var NESTED_OBJECT_NORMALISER_NAME = 'object';

function _getKeys(obj) {
    return Object.keys(obj);
}

function _isObject(value) {
    return value === Object(value);
}

function _isArray(value) {
    return {}.toString.call(value) === '[object Array]';
}

function _applyNormaliser(param, normaliserName, options) {
    var normaliser = normalisers[normaliserName];

    if (!normaliser) {
        throw new Error('Unknown normaliser \'' + normaliserName + '\' specified');
    }

    return normaliser(param, options);
}

function _handleNestedObject(nestedObj, normaliserOptions) {
    if (_isObject(nestedObj) && !_isArray(nestedObj)) {
        traverseNormaliser(nestedObj, normaliserOptions);
    }
}

function _handleArray(array, normaliserOptions) {
    if (!_isArray(array)) {
        return;
    }

    var normaliserNames = _getKeys(normaliserOptions);

    if (normaliserNames.indexOf(NESTED_OBJECT_NORMALISER_NAME) > -1) {
        // If there is a nested object normaliser, apply it to each value in the array.
        for (var i = 0; i < array.length; ++i) {
            traverseNormaliser(array[i], normaliserOptions[NESTED_OBJECT_NORMALISER_NAME]);
        }
    } else {
        // Apply each normaliser to each array value.
        for (var _i = 0; _i < array.length; ++_i) {
            for (var j = 0; j < normaliserNames.length; ++j) {
                // TODO options???
                array[_i] = _applyNormaliser(array[_i], normaliserNames[j]);
            }
        }
    }
}

function traverseNormaliser(params, normaliser) {
    if (params === null || params === undefined) {
        return;
    }

    // Loop through the names of all the properties to normalise at this recursion level.
    _getKeys(normaliser).forEach(function (propertyName) {
        // Loop through all the normalisers to apply to the property.
        _getKeys(normaliser[propertyName]).forEach(function (normaliserName) {
            var options = normaliser[propertyName][normaliserName];

            if (normaliserName === EACH_NORMALISER_NAME) {
                // This property should be an array.
                _handleArray(params[propertyName], options);
            } else if (normaliserName === NESTED_OBJECT_NORMALISER_NAME) {
                // This property should be a nested object; recurse into it if it is.
                _handleNestedObject(params[propertyName], options);
            } else {
                // Overwrite the current property value with the processed value.
                params[propertyName] = _applyNormaliser(params[propertyName], normaliserName, options);
            }
        });
    });
}

module.exports = exports = traverseNormaliser;