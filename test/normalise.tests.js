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

    describe('default', function() {
        const tests = [
            { arg: '', expected: '' },
            { arg: 'Foo', expected: 'Foo' },
            { arg: [], expected: [] },
            { arg: 0, expected: 0 },
            { arg: null, expected: 1 },
            { arg: undefined, expected: 1 }
        ];

        tests.forEach(function(test) {
            it('should return ' + JSON.stringify(test.expected) + ' for arg ' + JSON.stringify(test.arg), function() {
                const normalisers = {
                    name: {
                        default: 1
                    }
                };

                const params = {
                    name: test.arg
                };

                normalise(params, normalisers);
                should(params.name).eql(test.expected);
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

        it('should trim array of strings', function() {
            const normalisers = {
                names: {
                    primitivesEach: { 
                        trim: true
                    }
                }
            };

            const params = {
                names: [
                    '  foo  ',
                    '  Bar    '
                ]
            };

            normalise(params, normalisers);
            params.names[0].should.equal('foo');
            params.names[1].should.equal('Bar');
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
            { arg: null, expected: 'NaN' },
            { arg: undefined, expected: 'NaN' }
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
});
