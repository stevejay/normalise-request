'use strict';

function _isNil(param) {
    return param === null || param === undefined;
}

function _undefinedIfEmpty(param) {
    if (_isNil(param)) {
        return undefined;
    } else if (param.hasOwnProperty('length')) {
        return param.length === 0 ? undefined : param;
    } else {
        return param;
    }
}

function _toBool(param) {
    if (typeof param !== 'string') {
        return param;
    }

    var normalised = param.toLowerCase();

    if (normalised === 'true') {
        return true;
    } else if (normalised === 'false') {
        return false;
    }

    return param;
}

function _default(param, options) {
    var defaultValue = options && options.hasOwnProperty('value') ? options.value : options;

    if (defaultValue === undefined) {
        throw new Error('value option not specified for default normaliser');
    }

    return _isNil(param) ? defaultValue : param;
}

function _split(param, options) {
    var separator = options && options.hasOwnProperty('separator') ? options.separator : options;

    if (separator === undefined) {
        throw new Error('separator option not specified for split normaliser');
    }

    return typeof param === 'string' ? param.split(separator) : param;
}

module.exports = exports = {
    trim: function trim(param) {
        return typeof param !== 'string' ? param : param.trim();
    },
    toUpperCase: function toUpperCase(param) {
        return typeof param !== 'string' ? param : param.toUpperCase();
    },
    toLowerCase: function toLowerCase(param) {
        return typeof param !== 'string' ? param : param.toLowerCase();
    },
    undefinedIfEmpty: _undefinedIfEmpty,
    collapseWhitespace: function collapseWhitespace(param) {
        return typeof param !== 'string' ? param : param.replace(/\s{2,}/g, ' ');
    },
    replace: function replace(param, options) {
        return typeof param !== 'string' ? param : param.replace(options.pattern, options.newSubStr);
    },
    toFloat: function toFloat(param) {
        return typeof param === 'string' ? parseFloat(param) : param;
    },
    toInt: function toInt(param) {
        return typeof param === 'string' ? parseInt(param) : param;
    },
    toBool: _toBool,
    default: _default,
    decodeAsUriComponent: function decodeAsUriComponent(param) {
        return typeof param !== 'string' ? param : decodeURIComponent(param);
    },
    split: _split
};