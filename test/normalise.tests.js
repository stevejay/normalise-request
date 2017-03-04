'use strict';

const normalise = require('../index');
const should = require('should');

describe('normalise', () => {
    describe('applies normalisers in declaration order', () => {
        it('should trim and then set to undefined', () => {
            const normalisers = {
                name: {
                    trim: true,
                    undefinedIfEmpty: true
                }
            };

            const params = {
                name: '    '
            };

            normalise(params, normalisers);

            should(params).eql({ name: undefined });
        });

        it('should set to undefined and then trim', () => {
            const normalisers = {
                name: {
                    undefinedIfEmpty: true,
                    trim: true
                }
            };

            const params = {
                name: '    '
            };

            normalise(params, normalisers);

            should(params).eql({ name: '' });
        });
    });

    describe('unknown normaliser', () => {
        it('should throw error', () => {
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

    describe('null params', () => {
        it('should not throw error', () => {
            const normalisers = {
                name: {
                    trim: true
                }
            };

            normalise(null, normalisers);
        });
    });

    describe('undefined params', () => {
        it('should not throw error', () => {
            const normalisers = {
                name: {
                    trim: true
                }
            };

            normalise(undefined, normalisers);
        });
    });

    describe('empty params', () => {
        it('should not throw error', () => {
            const normalisers = {
                name: {
                    trim: true
                }
            };

            normalise({}, normalisers);
        });
    });

    describe('unknown property', () => {
        it('should not throw error', () => {
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

    describe('object', () => {
        it('should walk an object', () => {
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

        it('should ignore a null object', () => {
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

        it('should handle trying to walk an object but it is an array', () => {
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

            normalise(params, normalisers);

            should(params).eql({
                shipping: [{
                    address: '   foo ',
                    postcode: '  bar  '
                }]
            });
        });
    });

    describe('default', () => {
        const tests = [
            { arg: '', default: 1, expected: '' },
            { arg: 'Foo', default: 1, expected: 'Foo' },
            { arg: [], default: 1, expected: [] },
            { arg: 0, default: 1, expected: 0 },
            { arg: null, default: 1, expected: 1 },
            { arg: undefined, default: 1, expected: 1 },
            { arg: undefined, default: false, expected: false },
            { arg: null, default: null, expected: null },
            { arg: null, default: false, expected: false },
            { arg: undefined, default: null, expected: null }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg) + ' and default value ' + JSON.stringify(test.default), () => {
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

        it('should throw if default value is undefined', () => {
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

    describe('each', () => {
        it('should walk each of an array of objects', () => {
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

        it('should handle array normaliser when trying to walk something that is not an array', () => {
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

            normalise(params, normalisers);

            should(params).eql({
                shipping: { foo: 'bar' }
            });
        });

        it('should walk each of an array of strings', () => {
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

        it('should walk each of an array of objects where entire object is validated', () => {
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

    describe('trim', () => {
        const tests = [
            { arg: '   FOO   ', expected: 'FOO' },
            { arg: 'foo    bar', expected: 'foo    bar' },
            { arg: '   ', expected: '' },
            { arg: '', expected: '' },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), () => {
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

    describe('toUpperCase', () => {
        const tests = [
            { arg: 'Hello You', expected: 'HELLO YOU' },
            { arg: 'H  ', expected: 'H  ' },
            { arg: '', expected: '' },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), () => {
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

    describe('toLowerCase', () => {
        const tests = [
            { arg: 'Hello You', expected: 'hello you' },
            { arg: 'H  ', expected: 'h  ' },
            { arg: '', expected: '' },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), () => {
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

    describe('undefinedIfEmpty', () => {
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
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), () => {
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

    describe('collapseWhitespace', () => {
        const tests = [
            { arg: 'hello  you    there', expected: 'hello you there' },
            { arg: '  hello  you    there ', expected: ' hello you there ' },
            { arg: '  ', expected: ' ' },
            { arg: '', expected: '' },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), () => {
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

    describe('replace', () => {
        const tests = [
            { arg: 'Hello Hi', pattern: /H/g, expected: '-ello -i' },
            { arg: 'Boom', pattern: /H/g, expected: 'Boom' },
            { arg: '', pattern: /H/g, expected: '' },
            { arg: null, pattern: /H/g, expected: null },
            { arg: undefined, pattern: /H/g, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg) + ' and pattern ' + JSON.stringify(test.pattern), () => {
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

    describe('toFloat', () => {
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
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), () => {
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

    describe('toInt', () => {
        const tests = [
            { arg: '54', expected: 54 },
            { arg: 'H', expected: NaN },
            { arg: '', expected: NaN },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), () => {
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

    describe('toBool', () => {
        const tests = [
            { arg: '54', expected: '54' },
            { arg: true, expected: true },
            { arg: false, expected: false },
            { arg: 'True', expected: true },
            { arg: 'falSe', expected: false },
            { arg: '', expected: '' },
            { arg: '  ', expected: '  ' },
            { arg: 1, expected: 1 },
            { arg: 0, expected: 0 },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), () => {
                const normalisers = {
                    value: {
                        toBool: true
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

    describe('decodeAsUriComponent', () => {
        const tests = [
            { arg: 'http%3A%2F%2Fw3schools.com%2Fmy%20test.asp%3Fname%3Dst%C3%A5le%26car%3Dsaab', expected: 'http://w3schools.com/my test.asp?name=ståle&car=saab' },
            { arg: '%2F', expected: '/' },
            { arg: '   ', expected: '   ' },
            { arg: '', expected: '' },
            { arg: null, expected: null },
            { arg: undefined, expected: undefined }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), () => {
                const normalisers = {
                    value: {
                        decodeAsUriComponent: true
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

    describe('split', () => {
        const tests = [
            {
                args: {
                    value: 'foo,bar',
                    separator: ','
                },
                expected: ['foo', 'bar']
            },
            {
                args: {
                    value: 'foo',
                    separator: ' '
                },
                expected: ['foo']
            },
            {
                args: {
                    value: '',
                    separator: '-'
                },
                expected: ['']
            },
            {
                args: {
                    value: null,
                    separator: '-'
                },
                expected: null
            },
            {
                args: {
                    value: undefined,
                    separator: '-'
                },
                expected: undefined
            },
            {
                args: {
                    value: 99,
                    separator: '-'
                },
                expected: 99
            },
            {
                args: {
                    value: ['foo,', 'bar,'],
                    separator: ','
                },
                expected: ['foo,', 'bar,']
            }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for args ' + JSON.stringify(test.args), () => {
                const normalisers = {
                    value: {
                        split: test.args.separator
                    }
                };

                const params = {
                    value: test.args.value
                };

                normalise(params, normalisers);
                should(params.value).eql(test.expected);
            });
        });
    });
});
