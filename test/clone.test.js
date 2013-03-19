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
        var constructor = $object.clone({constructor: ''}).constructor;
        var c = $object.clone({constructor: ''});
            test.ok(constructor !== c.constructor);
            test.ok(constructor !== $object.clone().constructor);
            test.equal(typeof constructor, 'function');


        test.done();
    },


    create: function(test){
        var constructorCalled = false;
        var $myType = $object.clone({
            constructor: function(){
                constructorCalled = true;
            }
        });
        var instance = $myType.create({ignored: true});
            test.ok(constructorCalled);
            test.ok(typeof instance.ignored == 'undefined');

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
        var myArray = $object.copy(Array);
        myArray[0] = 11;
        myArray[1] = 22;
            test.deepEqual(myArray, [11 ,22]);

            myArray.defineProperties({test: 'T'});
                test.strictEqual(myArray.test, 'T');


        var $collection = $object.clone({items: []});
        var $users = $collection.clone({name: ''});

            // $users full prototype chain:
            //$users -> $collection -> $object -> Object.prototype -> null

            // see prototype chains produced by copy:

            var userCopy = $users.copy();
            //~$users -> $object
                test.equal(Object.getPrototypeOf(userCopy), $object);
                test.ok(userCopy.hasOwnProperty('name'));
                test.ok(userCopy.items === undefined);

            userCopy = $users.copy(Array);
            //~$users -> Array.prototype
                test.equal(Object.getPrototypeOf(userCopy), Array.prototype);
                test.ok(userCopy.hasOwnProperty('name'));
                test.ok(userCopy.items === undefined);
                test.ok(userCopy.clone === undefined);

            userCopy = $users.copy(Array, Infinity);
            //~$users -> ~$collection -> ~$object -> Array.prototype
                test.ok(userCopy.hasOwnProperty('name'));
                test.ok(userCopy.getPrototype().hasOwnProperty('items'));
                test.ok(userCopy.getPrototype().getPrototype().hasOwnProperty('clone'));
                test.ok(userCopy.getPrototype().getPrototype().getPrototype() === Array.prototype);

            userCopy = $users.copy(Array, Infinity, true);
            //~($users + $collection + $object) -> Array.prototype
                test.equal(Object.getPrototypeOf(userCopy), Array.prototype);
                test.ok(userCopy.hasOwnProperty('name'));
                test.ok(userCopy.hasOwnProperty('items'));
                test.ok(userCopy.hasOwnProperty('clone'));

        //TODO: add tests for deepCopy/deepClone

        test.done();
    },

    deepCopy: function(test){
        var obj = $object.clone({l1: {l2: {l3: null}}});
        var deepCopy = obj.deepCopy();
        test.strictEqual(deepCopy.l1.l2.l3, null);

            obj.l1.l2.l3 = 11;
                test.strictEqual(deepCopy.l1.l2.l3, null);

            deepCopy.l1.l2.l3 = 22;
                test.strictEqual(obj.l1.l2.l3, 11);

        test.done();
    },

    deepClone: function(test){
        var obj = $object.clone({l1: {l2: {l3: null}}});
        var deepClone = obj.deepClone();
            test.strictEqual(deepClone.l1.l2.l3, null);

            obj.l1.l2.l3 = 11;
                test.strictEqual(deepClone.l1.l2.l3, 11);

            deepClone.l1.l2.l3 = 22;
                test.strictEqual(obj.l1.l2.l3, 11);

        test.done();
    },

    callSuper: function(test){
        var calls = [];
        var $parent = $object.clone({
            constructor: function(arg){
                calls.push('collection');
                this.callSuper('constructor', arg);
            }
        });
        var $child = $parent.clone({
            constructor: function(arg){
                calls.push('users');
                this.callSuper('constructor', arg);
            }
        });

        var child = $child.create({setBy$objectConstructor: 11});
            test.deepEqual(calls, ['users','collection']);
            test.equal(child.setBy$objectConstructor, 11, '$object.constructor called');

        test.done();
    },

    apply: function(test){
        //methodName, args, withObj, asObj
        var asObj = {defineProperties: function(){
            this.called = true;
            return this;
        }};
        var obj = $object.apply('defineProperties',[{a:11}], Array(22,33), asObj);
            test.equal(obj.a, undefined);
            test.ok(obj.called);
            test.equal(obj[0], 22);
            test.equal(Object.getPrototypeOf(obj), Array.prototype);

        //methodName, args, withObj
        obj = $object.apply('defineProperties',[{a:11}], Array(22,33) );
            test.equal(obj.a,  11);
            test.equal(obj[0], 22);
            test.equal(Object.getPrototypeOf(obj), Array.prototype);

        //methodName, withObj
        obj = $object.apply('defineProperties', Array(22,33) );
            test.equal(obj[0], 22);
            test.equal(Object.getPrototypeOf(obj), Array.prototype);

        test.done();
    }


};
