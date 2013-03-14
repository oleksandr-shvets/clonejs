// nodeunit

var Clone = require('../src/clone.js');


module.exports = {

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
