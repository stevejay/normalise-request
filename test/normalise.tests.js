'use strict';

var normalise = require('../index');
var should = require('should');

describe('normalise', function() {
    describe('unknown normaliser', function() {
        it('should throw error', function() {
            const normalisers = {
                name: {
                    unknownTransform: true
                }
            };

            const params = {
                name: 'hello'
            };

            should.throws(() => normalise(params, normalisers));
        });
    });

    describe('unknown property', function() {
        it('should not throw error', function() {
            const normalisers = {
                name: {
                    trim: true
                }
            };

            const params = {
                otherProperty: 'hello'
            };

            normalise(params, normalisers);
        });
    });

    describe('object', function() {
        it('should walk an object', function() {
            const normalisers = {
                shipping: {
                    object: {
                        address: {
                            trim: true
                        },
                        postcode: {
                            trim: true
                        }
                    }
                }
            };

            const params = {
                shipping: {
                    address: '   foo ',
                    postcode: '  bar  '
                }
            };

            normalise(params, normalisers);

            should(params).eql({
                shipping: {
                    address: 'foo',
                    postcode: 'bar'
                }
            });
        });

        it('should ignore a null object', function() {
            const normalisers = {
                shipping: {
                    object: {
                        address: {
                            trim: true
                        },
                        postcode: {
                            trim: true
                        }
                    }
                }
            };

            const params = {
                shipping: null
            };

            normalise(params, normalisers);

            should(params).eql({
                shipping: null
            });
        });

        it('should throw if trying to walk an array', function() {
            const normalisers = {
                shipping: {
                    object: {
                        address: {
                            trim: true
                        },
                        postcode: {
                            trim: true
                        }
                    }
                }
            };

            const params = {
                shipping: [{
                    address: '   foo ',
                    postcode: '  bar  '
                }]
            };

            (() => normalise(params, normalisers)).should.throw(/is not an object$/);
        });
    });

    describe('default', function() {
        const tests = [
            { arg: '', default: 1, expected: '' },
            { arg: 'Foo', default: 1, expected: 'Foo' },
            { arg: [], default: 1, expected: [] },
            { arg: 0, default: 1, expected: 0 },
            { arg: null, default: 1, expected: 1 },
            { arg: undefined, default: 1, expected: 1 },
            { arg: null, default: null, expected: null },
            { arg: undefined, default: null, expected: null }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg) + ' and default value ' + JSON.stringify(test.default), function() {
                const normalisers = {
                    name: {
                        default: test.default
                    }
                };

                const params = {
                    name: test.arg
                };

                normalise(params, normalisers);
                should(params.name).eql(test.expected);
            });
        });

        it('should throw if default value is undefined', function() {
            const normalisers = {
                name: {
                    default: undefined
                }
            };

            const params = {
                name: 'foo'
            };

            (() => normalise(params, normalisers)).should.throw('value option not specified for default normaliser');
        });
    });

    describe('each', function() {
        it('should walk each of an array of objects', function() {
            const normalisers = {
                shipping: {
                    each: {
                        object: {
                            address: {
                                trim: true
                            }
                        }
                    }
                }
            };

            const params = {
                shipping: [
                    { address: '   foo ' },
                    { address: '  bar     ' },
                ]
            };

            normalise(params, normalisers);

            should(params).eql({
                shipping: [
                    { address: 'foo' },
                    { address: 'bar' }
                ]
            });
        });

        it('should throw if trying to walk something that is not an array', function() {
            const normalisers = {
                shipping: {
                    each: {
                        object: {
                            address: {
                                trim: true
                            }
                        }
                    }
                }
            };

            const params = {
                shipping: { foo: 'bar' }
            };

            (() => normalise(params, normalisers)).should.throw(/is not an array$/);
        });

        it('should walk each of an array of strings', function() {
            const normalisers = {
                shipping: {
                    each: {
                        trim: true
                    }
                }
            };

            const params = {
                shipping: [
                    '   foo ',
                    '  bar     '
                ]
            };

            normalise(params, normalisers);

            should(params).eql({
                shipping: ['foo', 'bar']
            });
        });

        it('should walk each of an array of objects where entire object is validated', function() {
            const normalisers = {
                shipping: {
                    each: {
                        undefinedIfEmpty: true
                    }
                }
            };

            const params = {
                shipping: [
                    [],
                    []
                ]
            };

            normalise(params, normalisers);

            should(params).eql({
                shipping: [undefined, undefined]
            });
        });
    });

    describe('trim', function() {
        const tests = [
            { arg: '   FOO   ', expected: 'FOO' },
            { arg: 'foo    bar', expected: 'foo    bar' },
            { arg: '   ', expected: '' },
            { arg: '', expected: '' },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), function() {
                const normalisers = {
                    shipping: {
                        object: {
                            address: {
                                trim: true
                            }
                        }
                    }
                };

                const params = {
                    shipping: {
                        address: test.arg
                    }
                };

                normalise(params, normalisers);
                should.equal(params.shipping.address, test.expected);
            });
        });
    });

    describe('toUpperCase', function() {
        const tests = [
            { arg: 'Hello You', expected: 'HELLO YOU' },
            { arg: 'H  ', expected: 'H  ' },
            { arg: '', expected: '' },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), function() {
                const normalisers = {
                    name: {
                        toUpperCase: true
                    },
                };

                const params = {
                    name: test.arg
                };

                normalise(params, normalisers);
                should(params.name).eql(test.expected);
            });
        });
    });

    describe('toLowerCase', function() {
        const tests = [
            { arg: 'Hello You', expected: 'hello you' },
            { arg: 'H  ', expected: 'h  ' },
            { arg: '', expected: '' },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), function() {
                const normalisers = {
                    name: {
                        toLowerCase: true
                    },
                };

                const params = {
                    name: test.arg
                };

                normalise(params, normalisers);
                should(params.name).eql(test.expected);
            });
        });
    });

    describe('undefinedIfEmpty', function() {
        const tests = [
            { arg: 26, expected: 26 },
            { arg: 0, expected: 0 },
            { arg: 'hello', expected: 'hello' },
            { arg: '  ', expected: '  ' },
            { arg: '', expected: undefined },
            { arg: null, expected: undefined },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), function() {
                const normalisers = {
                    name: {
                        undefinedIfEmpty: true
                    },
                };

                const params = {
                    name: test.arg
                };

                normalise(params, normalisers);
                should(params.name).eql(test.expected);
            });
        });
    });

    describe('collapseWhitespace', function() {
        const tests = [
            { arg: 'hello  you    there', expected: 'hello you there' },
            { arg: '  hello  you    there ', expected: ' hello you there ' },
            { arg: '  ', expected: ' ' },
            { arg: '', expected: '' },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), function() {
                const normalisers = {
                    name: {
                        collapseWhitespace: true
                    },
                };

                const params = {
                    name: test.arg
                };

                normalise(params, normalisers);
                should(params.name).eql(test.expected);
            });
        });
    });

    describe('replace', function() {
        const tests = [
            { arg: 'Hello Hi', pattern: /H/g, expected: '-ello -i' },
            { arg: 'Boom', pattern: /H/g, expected: 'Boom' },
            { arg: '', pattern: /H/g, expected: '' },
            { arg: null, pattern: /H/g, expected: null },
            { arg: undefined, pattern: /H/g, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg) + ' and pattern ' + JSON.stringify(test.pattern), function() {
                const normalisers = {
                    name: {
                        replace: { pattern: test.pattern, newSubStr: '-' }
                    },
                };

                const params = {
                    name: test.arg
                };

                normalise(params, normalisers);
                should(params.name).eql(test.expected);
            });
        });
    });

    describe('toFloat', function() {
        const tests = [
            { arg: '-0.98', expected: -0.98 },
            { arg: '9.98', expected: 9.98 },
            { arg: '2', expected: 2 },
            { arg: '0', expected: 0 },
            { arg: '  hello  you    there ', expected: 'NaN' },
            { arg: '  ', expected: 'NaN' },
            { arg: '', expected: 'NaN' },
            { arg: 54, expected: 54 },
            { arg: 54.8, expected: 54.8 },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), function() {
                const normalisers = {
                    value: {
                        toFloat: true
                    },
                };

                const params = {
                    value: test.arg
                };

                normalise(params, normalisers);

                if (test.expected === 'NaN') {
                    params.value.should.be.NaN();
                } else {
                    should(params.value).eql(test.expected);
                }
            });
        });
    });

    describe('toInt', function() {
        const tests = [
            { arg: '54', expected: 54 },
            { arg: 'H', expected: NaN },
            { arg: '', expected: NaN },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), function() {
                const normalisers = {
                    value: {
                        toInt: true
                    },
                };

                const params = {
                    value: test.arg
                };

                normalise(params, normalisers);
                should(params.value).eql(test.expected);
            });
        });
    });
});
