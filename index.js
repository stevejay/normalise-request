'use strict';

const normalise = function(params, normalisers) {
    walkNormalisers(params, normalisers);
    return params;
};

function walkNormalisers(params, normalisers) {
    const namesOfPropertiesToNormalise = Object.keys(normalisers);

    namesOfPropertiesToNormalise.forEach(nameOfPropertyToNormalise => {
        const namesOfNormalisersToApply = Object.keys(normalisers[nameOfPropertyToNormalise]);

        namesOfNormalisersToApply.forEach(nameOfNormaliser => {
            const normaliserOptions = normalisers[nameOfPropertyToNormalise][nameOfNormaliser];

            if (nameOfNormaliser === 'each') {
                const arrayValues = params[nameOfPropertyToNormalise];
                const namesOfNormalisers = Object.keys(normaliserOptions);

                if (isArray(arrayValues)) {
                    if (namesOfNormalisers.indexOf('object') > -1) {
                        for (var i = 0; i < arrayValues.length; ++i) {
                            walkNormalisers(arrayValues[i], normaliserOptions.object);
                        }
                    } else {
                        for (let i = 0; i < arrayValues.length; ++i) {
                            for (let j = 0; j < namesOfNormalisers.length; ++j) {
                                arrayValues[i] = applyNormaliser(
                                    namesOfNormalisers[j],
                                    {},
                                    arrayValues[i]);
                            }
                        }
                    }
                } else if (isDefined(arrayValues)) {
                    throw new Error(`${nameOfPropertyToNormalise} is not an array`);
                }
            } else if (nameOfNormaliser === 'object') {
                const value = params[nameOfPropertyToNormalise];

                if (isObject(value) && !isArray(value)) {
                    walkNormalisers(value, normaliserOptions);
                } else if (isDefined(value)) {
                    throw new Error(`${nameOfPropertyToNormalise} is not an object`);
                }
            } else {
                params[nameOfPropertyToNormalise] = applyNormaliser(
                    nameOfNormaliser,
                    normaliserOptions,
                    params[nameOfPropertyToNormalise]);
            }
        });
    });
}

function applyNormaliser(name, options, param) {
    const normaliser = normalise.normalisers[name];

    if (!normaliser) {
        throw new Error('Unknown normaliser \'' + name + '\' specified');
    }

    return normaliser(param, options);
}

function isObject(value) {
    return value === Object(value);
}

function isArray(value) {
    return {}.toString.call(value) === '[object Array]';
}

function isDefined(value) {
    return value !== null && value !== undefined;
}

normalise.normalisers = {
    trim: param => typeof param !== 'string' ? param : param.trim(),
    toUpperCase: param => typeof param !== 'string' ? param : param.toUpperCase(),
    toLowerCase: param => typeof param !== 'string' ? param : param.toLowerCase(),
    undefinedIfEmpty: param => {
        if (param === null || param === undefined) { 
            return undefined;
        } else if (param.hasOwnProperty('length')) {
            return param.length === 0 ? undefined : param;
        } else {
            return param;
        }
    },
    collapseWhitespace: param => typeof param !== 'string' ?
        param :
        param.replace(/\s{2,}/g, ' '),
    replace: (param, options) => {
        if (typeof param !== 'string') {
            return param;
        }

        return param.replace(options.pattern, options.newSubStr);
    },
    toFloat: param => typeof param === 'string' ? parseFloat(param) : param,
    toInt: param => typeof param === 'string' ? parseInt(param) : param,
    default: (param, options) => {
        const defaultValue = options && options.hasOwnProperty('value') ?
            options.value :
            options;

        if (defaultValue === undefined) {
            throw new Error('value option not specified for default normaliser');
        }

        return param === null || param === undefined ? defaultValue : param;
    },
    decodeAsUriComponent: param => {
        if (typeof param !== 'string') {
            return param;
        }

        return decodeURIComponent(param);
    },
    split: (param, options) => {
        const separator = options && options.hasOwnProperty('separator') ?
            options.separator :
            options;

        if (separator === undefined) {
            throw new Error('separator option not specified for split normaliser');
        }
        
        return typeof param === 'string' ? param.split(separator) : param;
    }
};

module.exports = normalise;
