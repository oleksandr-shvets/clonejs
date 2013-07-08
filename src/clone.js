/**
 * @class
 * clone.js - the true prototype-based javascript nano-framework.
 * @version v1.0.0-alpha
 * @see www.clonejs.org
 * @description
 * Function `clone` works like `Object.create`, but the second argument is simple object, not property descriptor.
 * @param {!Object} obj - Object to clone
 * @param {!object} state - The properties of new, cloned object, should be object literal only ({key:"value"})
 * @param {Object=} behavior$ - The behavior (methods) of new, cloned object)
 */
var clone = (function(){
    function clone(/** !Object */obj, /** !object */state, /** Object= */behavior$){
        var newObj = clone2(obj, behavior$ || state);
        if(behavior$){
            newObj = clone2(newObj, state);
            if( behavior$.__inits__ ){
                var accessors = behavior$.__inits__;
                for(var key in accessors){
                    clone.defineInitProperty(behavior$, key, accessors[key],
                        {configurable:true},
                        {configurable:true, writable:true, enumerable:true}
                    );
                }
                delete behavior$.__inits__;
            }
        }
        return newObj;
    }
    
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // setup functions (depends on JavaScript version):
    
    var clone2 =      '__proto__' in Object ? clone_byProto         : clone_byConstructor;
    var define = 'defineProperty' in Object && (typeof(window)==='undefined' || window.XMLHttpRequest)// ie9+ detection
                                            ? Object.defineProperty : defineProperty_shim;
    var freeze =         'freeze' in Object ? Object.freeze         : function(){};
    
    // shim:
    
    if(Object.getPrototypeOf === undefined) Object.getPrototypeOf = function Object_getPrototypeOf(obj){
        return obj.hasOwnProperty('__proto__') ? Object.prototype : obj.__proto__;
    };
    if(Object.create === undefined) Object.create = function Object_create(obj, /** Object= */descriptors){
        var newObj = clone(obj, {});
        for(var key in descriptors){
            describe(newObj, key, descriptors[key]);
        }
        return newObj;
    };

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // static methods:

    clone.defineProperty = define;

    clone.defineInitProperty = function defineInitProperty(obj, propertyName, getter, descriptor, initedDescriptor){
//        if( initedDescriptor === undefined){
//            initedDescriptor = descriptor ? {
//                writable:     descriptor.writable,
//                enumerable:   descriptor.enumerable,
//                configurable: descriptor.configurable
//            } : {
//                writable:     true,
//                enumerable:   true,
//                configurable: true
//            };
//        }else initedDescriptor = clone2(initedDescriptor, {});
//        if( descriptor === undefined){
//            descriptor = {enumerable:false, configurable:true};
//        }else{
//            descriptor = clone2(descriptor, {});
//        }//</arguments>
        descriptor = clone2(descriptor, {
            get: function clone_initGetter(){
                return this[propertyName] = /* <- call setter */getter.call(this, propertyName, initedDescriptor);
            },
            set: function clone_initSetter(value){
                initedDescriptor.value = value;
                define(this, propertyName, initedDescriptor);
            }
        });
        define(obj, propertyName, descriptor);
    };
    
    clone.defineConstructor = function clone_defineConstructor(obj, /** string='constructor' */propertyName){
        function InitClone(state){
            for(var key in state) this[key] = state[key];
        }
        InitClone.prototype = obj;
        define(obj, propertyName||'constructor', {value: InitClone, writable:true, configurable:true});
        return InitClone;
    };
    
    clone.create = function clone_create(/** !object */state, /** object= */behavior$){
        return clone(clone.prototype, state, behavior$);
    };// clone.bind(null, clone.prototype);
    
    clone.new = function clone_new(/** !Object */obj,/** ...? */ state, arg1, arg2, arg3, arg4, arg5){
        return                 new               obj.constructor(state, arg1, arg2, arg3, arg4, arg5);
    };

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // behavior of all created by clone.create objects:
    
    var prototype = [
        /** @memberOf clone# */
        function $clone(/** object=object */state, /** object= */behavior$){
            return clone(this, state||{}, behavior$);
        },
        /** @memberOf clone# */
        function $extend(/** !object */state, /** object= */behavior$){
            var newBehavior$ = clone(this, state, behavior$);

            //clone.defineConstructor(behavior$ || newBehavior$);

            if(behavior$){
                freeze(behavior$);
            }
            freeze(newBehavior$);

            return newBehavior$;
        },
        /** @memberOf clone# */
        function  $new(/** !Object */obj,/** ...? */ state, arg1, arg2, arg3, arg4, arg5){
            return new               obj.constructor(state, arg1, arg2, arg3, arg4, arg5);
        }
    ];
    for(var i=0, sz=prototype.length; i<sz; i++){
        var method = prototype[i];
        define(clone.prototype, method.name, {value: method, writable:true, configurable:true});
    }

    return clone; // // // // // // // // // // // // // // // // // // // // //
    // utility functions:

    function clone_byProto(/** !Object */obj, /** !object */state){
        state.__proto__ = obj;
        return state;
    }

//    function clone_byConstructorAndProto(obj, state){
//        if('__proto__' in obj){
//        }else{
//            state = clone_byConstructor(obj, state);
//        }
//        return clone_byProto(obj, state);
//    }
    
//    function clone_byObjectCreate(/** !Object */proto, /** object= */state){
//        var newObj = Object.create(proto);
//        for(var key in state) newObj[key] = state[key];
//        return newObj;
//    }

    function clone_byConstructor(/** !Object */proto, /** object= */state){
        var  OwnConstructor = state.hasOwnProperty('constructor') && state.constructor.InitClone || state.constructor;
        if(! OwnConstructor || OwnConstructor.name != 'InitClone'){
            try{// to modify OwnConstructor, warn on errors.
                // cache created constructor (if proto does not have own constructor):
                if(OwnConstructor === false){
                    var NewConstructor = clone.defineConstructor(proto);
                }else{
                    // cache constructor for objects, that already has custom constructor:
                    NewConstructor = clone.defineConstructor(OwnConstructor, 'InitClone');
                    //
                    if( OwnConstructor.prototype !== proto){
                        OwnConstructor.prototype = proto;
                    }
                }
                //
                if( proto.__proto__ !== proto){
                    proto.__proto__ = proto;
                }
            }catch(err){
                console && console.warn(err);
            }
            OwnConstructor = NewConstructor;
            
        }
        return new OwnConstructor(state);
    }
    
    function defineProperty_shim(/** !Object */obj, /** string */propertyName, /** !Object */descriptor){
        var proto = obj.__proto__ || obj;
        if(descriptor.get || descriptor.set){
            var PropertyName  = propertyName[0].toUpperCase() + propertyName.substring(1);
            obj[propertyName] = function initAccessor_shim(value){
                if(value){
                    obj["set" + PropertyName](value);
                }else{
                    return obj["get" + PropertyName](value);
                }
            };
            if (descriptor.get){
                proto["get" + PropertyName] = descriptor.get;
            }if(descriptor.set){
                proto["set" + PropertyName] = descriptor.set;
            }
        }else{
            if( descriptor.enumerable ){
                obj[propertyName] = descriptor.value;
            }else{
                proto[propertyName] = descriptor.value;
            }
        }
    }
})();

if(module) module.exports = clone;