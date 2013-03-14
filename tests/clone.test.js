// nodeunit

var Clone = require('../src/clone.js');


module.exports = {

    Clone: function(test){
        var $proto = {a: 1};
        var clone = Clone($proto);

        test.equal( Object.getPrototypeOf(clone), $proto,
            'check prototype');

        clone = Clone($proto, {b:2});
        test.ok( clone.hasOwnProperty('b') );

        clone = Clone($proto, {b:2}, {});
        test.ok( clone.hasOwnProperty('b') );

        test.done();
    },

    constructor: function(test){
        var clone = new Clone({a:1});

        test.ok( clone.hasOwnProperty('a') );

        test.done();
    },

    describe: function(test){

        //test.expect(2);

        test.deepEqual(
            Clone.describe({
                _p: undefined,
                '(const) _unwritable': 231,
                method: Function,
                constructor: Clone
            }),{
                _p: {value: undefined, enumerable:false},
                _unwritable: {value: 231, enumerable:false, writable: false},
                method: {value: Function, enumerable:false},
                constructor: {value: Clone, enumerable:false}
            },
            'private properties, functions, constructor should be not enumerable'
        );


        test.done();
    }
}
