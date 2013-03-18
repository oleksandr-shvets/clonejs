// nodeunit

var $object = require('../src/clone.js');


module.exports = {


    clone: function(test){


        var clone = $object.clone({a:1});
        test.ok( clone.hasOwnProperty('a') );
        test.equal( Object.getPrototypeOf(clone), $object);
        test.strictEqual( Object.getOwnPropertyNames(clone).length, 1);

        clone = $object.clone({a:1}, {});
        test.ok( clone.hasOwnProperty('a') );
        test.equal( Object.getPrototypeOf(clone), $object);
        test.strictEqual( Object.getOwnPropertyNames(clone).length, 1);

        clone = $object.clone();
        test.strictEqual( Object.getOwnPropertyNames(clone).length, 0);
        test.equal( Object.getPrototypeOf(clone), $object);

        test.done();
    },

    'clone.call': function(test){
        var $proto = {a: 1};
        var clone = $object.clone.call($proto);

        test.equal( Object.getPrototypeOf(clone), $proto,
            'check prototype');

        clone = $object.clone.call($proto, {b:2});
        test.ok( clone.hasOwnProperty('b') );

        clone = $object.clone.call($proto, {b:2}, {});
        test.ok( clone.hasOwnProperty('b') );

        test.done();
    },

    'clone.constructor': function(test){
        var fn = function(){};

        var constructor = $object.clone({constructor: ''}).constructor;
        var c = $object.clone({constructor: ''});
        test.ok(constructor !== c.constructor);
        test.ok(constructor !== $object.clone().constructor);
        test.equal(typeof constructor, 'function');

        //Object.freeze(fn);
//        constructor = $object.clone({create: fn}).constructor;

        //todo

        test.done();
    },


    create: function(test){

        test.done();
    },

    describe: function(test){

        //test.expect(2);

        test.deepEqual(
            $object.describe({
                _p: undefined,
                '(const) _unwritable': 231,
                method: Function,
                constructor: Function
            }),{
                _p: {value: undefined, enumerable:false},
                _unwritable: {value: 231, enumerable:false, writable: false},
                method: {value: Function, enumerable:false},
                constructor: {value: Function, enumerable:false}
            },
            'private properties, functions, constructor should be not enumerable'
        );

        //todo


        test.done();
    },

    can: function(test){

        var $myObj = $object.clone({
            fly: function(){},
            swim: function(a,b,c){}
        });
        var myObj = $myObj.create();


        test.ok(!! myObj.can('swim').as($myObj) );
        test.ok(!! $object.can.call(myObj, 'fly').like($myObj) );

        //todo

        test.done();
    },

    copy: function(test){
        //var $myArray1 = $object.clone.call(Array.prototype, {customMethod: function(){}});
        var myArray = $object.copy(Array);//.defineProperties({test: 'T'});
        myArray[0] = 11;
        myArray[1] = 22;
        test.deepEqual(myArray, [11 ,22]);

        //concat($collection, ['next','prev'])

        test.done();
    },

    template: function(test){

        test.done();
    },


};
