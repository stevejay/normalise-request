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

    const normalised = param.toLowerCase();

    if (normalised === 'true') {
        return true;
    } else if (normalised === 'false') {
        return false;
    }

    return param;
}

function _default(param, options) {
    const defaultValue = options && options.hasOwnProperty('value') ?
        options.value : options;

    if (defaultValue === undefined) {
        throw new Error('value option not specified for default normaliser');
    }

    return _isNil(param) ? defaultValue : param;
}

function _split(param, options) {
    const separator = options && options.hasOwnProperty('separator') ?
        options.separator :
        options;

    if (separator === undefined) {
        throw new Error('separator option not specified for split normaliser');
    }
    
    return typeof param === 'string' ? param.split(separator) : param;
}

module.exports = exports = {
    trim: param => typeof param !== 'string' ? param : param.trim(),
    toUpperCase: param => typeof param !== 'string' ? param : param.toUpperCase(),
    toLowerCase: param => typeof param !== 'string' ? param : param.toLowerCase(),
    undefinedIfEmpty: _undefinedIfEmpty,
    collapseWhitespace: param => 
        typeof param !== 'string' ? param : param.replace(/\s{2,}/g, ' '),
    replace: (param, options) => typeof param !== 'string' ?
        param : param.replace(options.pattern, options.newSubStr),
    toFloat: param => typeof param === 'string' ? parseFloat(param) : param,
    toInt: param => typeof param === 'string' ? parseInt(param) : param,
    toBool: _toBool,
    default: _default,
    decodeAsUriComponent: param => typeof param !== 'string' ?
        param : decodeURIComponent(param),
    split: _split
};
