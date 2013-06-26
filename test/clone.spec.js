// nodeunit
var object = _.prototype;

this.tests = {

    clone: {
        '': function(test){
            var clone = _({a:1});
                test.ok( clone.hasOwnProperty('a') );
                test.equal( Object.getPrototypeOf(clone), object);
                test.strictEqual( Object.getOwnPropertyNames(clone).length, 1);
    
            clone = object.clone({a:1}, {});
                test.ok( clone.hasOwnProperty('a') );
                test.equal( Object.getPrototypeOf(clone), object);
                test.strictEqual( Object.getOwnPropertyNames(clone).length, 1);
    
            clone = _();
                test.strictEqual( Object.getOwnPropertyNames(clone).length, 0);
                test.equal( Object.getPrototypeOf(clone), object);
            
            clone = object.clone.call(null, {a:1});
                test.ok( clone !== null );
                test.equal(typeof clone, 'object');
                test.ok( object.hasOwnProperty.call(clone, 'a') );
                test.strictEqual( Object.getPrototypeOf(clone), null);

            test.done();
        },
    
        call: function(test){
            var $proto = {a: 1};
    
                var clone = _($proto, 'clone');
                    test.equal( Object.getPrototypeOf(clone), $proto,
                        'check prototype');
    
                clone = object.clone.call($proto, {b:2});
                    test.ok( clone.hasOwnProperty('b') );
    
                clone = object.clone.call($proto, {b:2}, {});
                    test.ok( clone.hasOwnProperty('b') );
    
            test.done();
        },
    
        constructor: function(test){
            var constructor = _({constructor: ''}).constructor;
            var c = _({constructor: ''});
                test.ok(constructor !== c.constructor);
                test.ok(constructor !== _().constructor);
                test.equal(typeof constructor, 'function');
    
    
            test.done();
        }
    },

    create: {
        
        '': function(test){
            var customConstructorCalled = false;
            var $myType = _({
                constructor: function(){
                    customConstructorCalled = true;
                }
            });
            var instance = $myType.create({ignored: true});
                test.ok(customConstructorCalled);
                test.ok(typeof instance.ignored == 'undefined');
    
    //        instance = $object.create();
    //            test.ok( Object.isSealed(instance), 'the created object should be sealed by default');
    
            test.done();
        },
        
        'super property should can be modified': function(test){
            
            var obj = _({a: 1}).create();
            obj.a = 2;
                
                test.equal(obj.a, 2);
            
            test.done();
        }
    },

    describe:{
        
        '_private, modifiers: const, hidden, writable, final': function(test){
            
            function Constructor(){};
    
            test.deepEqual(
                object.describe({
                                          _p: undefined,
                       '(const) _unwritable': 231,
                                  property1 : 11,
                        '(hidden) property2': 22,
                      '(writable) property3': 33,
                         '(final) property4': 44,
                '(final writable) property5': 55,
//                              '(get) getter': Function,
//                              '(set) setter': Function,
//                            '(get) p2getter': 'property2',
                                     method : Function,
                                constructor : Constructor
                }),{
                                          _p: {value: undefined, enumerable:false},
                                 _unwritable: {value: 231, enumerable:false, writable: false},
                                   property1: {value: 11},
                                   property2: {value: 22, enumerable:false},
                                   property3: {value: 33, writable:true},
                                   property4: {value: 44, configurable: false},
                                   property5: {value: 55, writable:true, configurable: false},
//                                      getter: {get: Function},
//                                      setter: {'set': Function, enumerable:false},
//                                    p2getter: {get: Function},
                                      method: {value: Function, enumerable:false},
                                 constructor: {value: Constructor, enumerable:false}
                }
            );
    
            test.done();
        },
        
        'constructor': function(test){
            var proto = {};
            var descriptors = object.describe.call(proto, {constructor: 'MyCustomName'});

                var constructor = descriptors.constructor.value;
                test.equal(typeof constructor, 'function');
                test.equal(constructor.name, 'MyCustomName');
                test.equal(constructor.typeName, 'MyCustomName');
                test.strictEqual(constructor.prototype, proto);

//            var $obj = $().clone();
//            constructor.call($obj, {key: 11});
//
//                test.equal($obj.key, 11);

            test.done();            
        },

        'get, set modifiers': function(test){
            
            var obj = _({
                _private: 1,
                getterValue: 2,
                setterValue: 0,
                '(get) priv': '_private',
                '(get) getter': function(){
                    return this.getterValue;
                },
                '(set) setter': function(value){
                    this.setterValue = value;
                }
            });
            
            test.equal(obj.priv, 1);
            test.equal(obj.getter, 2);
            obj.setter = 3;
            test.equal(obj.setterValue, 3);
            
            test.done();    
        },
        
        'init modifier': function(test){
            var obj = _({
                getterCalls: 0,
                setterCalls: 0,
                '(init) getterOnce': function(){
                    this.getterCalls++;
                    return 'G';
                },
                '(init) setterOnce': function(value){
                    this.setterCalls++;
                    return value;
                }
            });

            test.equal(obj.getterOnce, 'G');
            test.equal(obj.getterOnce, 'G');
            test.equal(obj.getterCalls, 1);

            obj.setterOnce = 'S1';
            test.equal(obj.setterOnce, 'S1');
            obj.setterOnce = 'S2';
            test.equal(obj.setterOnce, 'S2');
            test.equal(obj.setterCalls, 1);
            
            test.done();
        }
    },

//    'can, cant': function(test){
//
//        var $myObj = $({
//            fly: function(){},
//            swim: function(a,b,c){}
//        });
//        var myObj = $myObj.create();
//            test.ok(!!   myObj.can('swim').as($myObj) );
//            test.ok(!! $object.can.call(myObj, 'fly').like($myObj) );
//
//            test.ok(!    myObj.cant('swim').as($myObj) );
//            test.ok(!  $object.cant.call(myObj, 'fly').like($myObj) );
//
//        test.done();
//    },

    copy: function(test){
        var myArray = object.copy(Array);
        myArray[0] = 11;
        myArray[1] = 22;
            test.deepEqual(myArray, [11 ,22]);

            myArray.defineFields({test: 'T'});
                test.strictEqual(myArray.test, 'T');


        var $collection = _({items: []});
        var $users = $collection.clone({name: ''});
        
        var injected = Object.prototype === object;

            // $users full prototype chain:
            //$users -> $collection -> $object -> Object.prototype -> null

            // see prototype chains produced by copy:

            var userCopy = $users.copy();
            //~$users -> $object
                test.deepEqual(Object.getPrototypeOf(userCopy), object);
                test.ok(userCopy.hasOwnProperty('name'));
                test.ok(userCopy.items === undefined);

            userCopy = $users.copy(Array);
            //~$users -> Array.prototype
                test.deepEqual(Object.getPrototypeOf(userCopy), Array.prototype);
                test.ok(userCopy.hasOwnProperty('name'));
                test.ok(userCopy.items === undefined);
                if(!injected) test.ok(userCopy.clone === undefined);

            userCopy = $users.copy(Array, Infinity);
            //~$users -> ~$collection -> ~$object -> Array.prototype
                test.ok(userCopy.hasOwnProperty('name'));
                test.ok(userCopy.getProto().hasOwnProperty('items'));
                if(!injected) test.ok(userCopy.getProto().getProto().hasOwnProperty('clone'));
                test.deepEqual(userCopy.getProto().getProto().getProto(), Array.prototype);

            userCopy = $users.copy(Array, Infinity, true);
            //~($users + $collection + $object) -> Array.prototype
                test.deepEqual(Object.getPrototypeOf(userCopy), Array.prototype);
                test.ok(userCopy.hasOwnProperty('name'));
                test.ok(userCopy.hasOwnProperty('items'));
                if(!injected) test.ok(userCopy.hasOwnProperty('clone'));

        //TODO: add tests for deepCopy/deepClone

        test.done();
    },

    deepCopy: function(test){
        var obj = _({l1: {l2: {l3: null}}});
        var deepCopy = obj.deepCopy();
        test.strictEqual(deepCopy.l1.l2.l3, null);

            obj.l1.l2.l3 = 11;
                test.strictEqual(deepCopy.l1.l2.l3, null);

            deepCopy.l1.l2.l3 = 22;
                test.strictEqual(obj.l1.l2.l3, 11);

        test.done();
    },

    deepClone: function(test){
        var obj = _({l1: {l2: {l3: null}}});
        var deepClone = obj.deepClone();
            test.strictEqual(deepClone.l1.l2.l3, null);

            obj.l1.l2.l3 = 11;
                test.strictEqual(deepClone.l1.l2.l3, 11);

            deepClone.l1.l2.l3 = 22;
                test.strictEqual(obj.l1.l2.l3, 11);

        test.done();
    },

    '__super__': {
        'callSuper, applySuper': function(test){
            var calls = [];
            var $parent = _({
                test: 11,
                constructor: function(arg){
                    calls.push('collection');
                    this.callSuper('constructor', arg);
                }
            });
            var $child = $parent.clone({
                constructor: function(arg){
                    calls.push('users');
                    this.applySuper(arguments);
                }
            });
            var child = $child.create({test: 11});
                
                test.deepEqual(calls, ['users','collection']);
                test.equal(child.test, 11);
    
            test.done();
        },
        
        'createSuperSafeCallback, __super__': function(test){
    
            test.expect(3);
    
            var $parent = _({
                testSuper: function(){
                    test.strictEqual(this.__super__, object);
                }
            });
            var $child = $parent.clone({
                constructor: function(){
                    this.applySuper();
                    test.strictEqual(this.__super__, $parent);
                },
                
                asyncCheck: function(){
                    var callback = this.createBoundMethod(function(){
                        test.strictEqual(this.__super__, $parent);
                        this.applySuper('testSuper');                    
                    },this);
                    
                    setTimeout(callback, 0);
                }
            });
    
            var child = $child.create();
            child.asyncCheck();
    
            setTimeout(function(){
                test.done();
            },0);
        },
        
        "first call applySuper() on sealed object \
         should doesn't throw an error": function(test){
            
            var $parent = _({
                method: function(){}
            });
            var $child = $parent.clone({
                method: function(arg){
                    this.applySuper('method');
                }
            });
            var child = $child.clone();
            child.seal();
                
                test.doesNotThrow(function(){
                    child.method();    
                });

            test.done();
        }
    },

//    apply: function(test){
//        //methodName, args, withObj, asObj
//        var asObj = {defineProperties: function(){
//            this.called = true;
//            return this;
//        }};
//        var obj = $object.apply(Array(22,33), 'defineProperties',[{a:11}], asObj);
//            test.equal(obj.a, undefined);
//            test.ok(obj.called);
//            test.equal(obj[0], 22);
//            test.equal(Object.getPrototypeOf(obj), Array.prototype);
//
//        //methodName, args, withObj
//        obj = $object.apply(Array(22,33), 'defineProperties',[{a:11}]);
//            test.equal(obj.a,  11);
//            test.equal(obj[0], 22);
//            test.equal(Object.getPrototypeOf(obj), Array.prototype);
//
//        //methodName, withObj
//        obj = $object.apply(Array(22,33), 'defineProperties');
//            test.equal(obj[0], 22);
//            test.equal(Object.getPrototypeOf(obj), Array.prototype);
//
//        test.done();
//    },

    paste: function(test){
        var $parent = _({a: 1});
        var $child  = $parent.clone({b: 2});
        var $mixin  = $child .clone({c: 3, _c: 33});

            var mix = $mixin.paste({});
                test.strictEqual(mix._c, 33);
                test.strictEqual(mix.c,  3);
                test.strictEqual(mix.b,  undefined);
                test.strictEqual(mix.a,  undefined);

            mix = $mixin.paste({}, ['a','_c']);
                test.strictEqual(mix._c, 33);
                test.strictEqual(mix.c,  undefined);
                test.strictEqual(mix.b,  undefined);
                test.strictEqual(mix.a,  1);

            mix = $mixin.paste({}, true);
                test.strictEqual(mix._c, 33);
                test.strictEqual(mix.c,  3);
                test.strictEqual(mix.b,  2);
                test.strictEqual(mix.a,  1);

        test.done();
    },

    getPrototypes: function(test){
        var $obj = _({n:1})
                          .clone({n:2})
                          .clone({n:3})
                          .create();
        
            test.deepEqual($obj.getPrototypes(), [{n:1}, {n:2}, {n:3}]);
            test.deepEqual($obj.getPrototypes(undefined, true), [{n:3}, {n:2}, {n:1}]);
            var prototypes = $obj.getPrototypes(Object.prototype);
            if( object === Object.prototype ){
                test.deepEqual(prototypes, [{n:1}, {n:2}, {n:3}]);
            }else{
                test.deepEqual(prototypes, [object, {n:1}, {n:2}, {n:3}]);
                test.strictEqual(prototypes[0], object);
            }
            
            //test.deepEqual($obj.getPrototypes(null), [Object.prototype, Object.prototype, {n:1}, {n:2}, {n:3}]);
        
        test.done();
    },

    getValues: function(test){
        var obj = _({en:'1 0', _p:'0 0'}).clone({ownEn:'1 1', _own:'0 1'});
        //                      enumerable,   own
        test.deepEqual(obj.getValues(true,   true).sort(), [ '1 1' ]); 
        test.deepEqual(obj.getValues(false, false).sort(), [ '0 0', '0 1', '1 0', '1 1' ]);
        test.deepEqual(obj.getValues(false,  true).sort(), [ '0 1', '1 1' ]);
        test.deepEqual(obj.getValues(true,  false).sort(), [ '1 0', '1 1' ]); 
        
        test.done();
    },

    setValues: function(test){
        var obj = _({en:'1 0', _p:'0 0'}).clone({ownEn:'1 1', _own:'0 1'}), values;

        values = obj.getValues();
            test.deepEqual(obj, obj.copy(Infinity).setValues(values) );
       
        values = obj.getValues(true);
            test.deepEqual(obj, obj.copy(Infinity).setValues(values, true) );

        values = obj.getValues(false);
            test.deepEqual(obj, obj.copy(Infinity).setValues(values, false) );
        
//        values = obj.getValues(true, false);
//            test.deepEqual(obj, obj.copy(Infinity).setValues(values, true,  false) );
        
        values = obj.getValues(false, true);
            test.deepEqual(obj, obj.copy(Infinity).setValues(values, false, true) );
        
//        values = obj.getValues(false, false);
//            test.deepEqual(obj, obj.copy(Infinity).setValues(values, false, false) );
        
        
        test.done();
    }

};
