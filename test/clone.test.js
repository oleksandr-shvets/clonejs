// nodeunit

var Clone = require('../src/clone.js');


module.exports = {

    static: {

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

        make: function(test){

            var clone = new Clone({a:1});
            test.ok( clone.hasOwnProperty('a') );
            test.strictEqual( Object.getOwnPropertyNames(clone).length, 1);

            clone = Clone.make({a:1});
            test.ok( clone.hasOwnProperty('a') );
            test.equal( Object.getPrototypeOf(clone), Clone.prototype);
            test.strictEqual( Object.getOwnPropertyNames(clone).length, 1);

            clone = new Clone({a:1}, {});
            test.ok( clone.hasOwnProperty('a') );
            test.strictEqual( Object.getOwnPropertyNames(clone).length, 1);

            clone = Clone.make({a:1}, {});
            test.ok( clone.hasOwnProperty('a') );
            test.equal( Object.getPrototypeOf(clone), Clone.prototype);
            test.strictEqual( Object.getOwnPropertyNames(clone).length, 1);

            clone = new Clone;
            test.strictEqual( Object.getOwnPropertyNames(clone).length, 0);

            clone = Clone.make();
            test.strictEqual( Object.getOwnPropertyNames(clone).length, 0);
            test.equal( Object.getPrototypeOf(clone), Clone.prototype);

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

            //todo


            test.done();
        },

        defineType: function(test){
            var fn = function(){};

            var constructor = Clone.defineType();
                test.notEqual(constructor, Clone.defineType());
                test.equal(typeof constructor, 'function');

            constructor = Clone.defineType('MyName');
                test.equal(constructor.typeName, 'MyName');
                test.equal(typeof constructor, 'function');

            //Object.freeze(fn);
            constructor = Clone.defineType(fn);

            //todo

            test.done();
        },

        can: function(test){

            var $clone = Clone.make({
                fly: function(){},
                swim: function(a,b,c){}
            });
            var clone = $clone.create();


            test.ok( Clone.can(clone, 'fly').like($clone) );
            test.ok( Clone.can(clone, 'swim').as($clone) );

            //todo

            test.done();
        },


        template: function(test){

            test.done();
        },

    },

    prototype: {

        constructor: function(test){


            test.done();
        },


        template: function(test){

            test.done();
        },
    }
};

