/**#nocode+*/
void function(global){"use strict";
     function defineModule(){
/**#nocode-*/
    /**
     * @class
     *
     * clone.js - the true prototype-based javascript nano-framework.
     * @version v1.0.1-alpha
     * @author  Alex Shvets
     * @see     www.clonejs.org
     *
     * @description
     * 
     * **clone()** function:  
     *   
     * Create new object, inherited from other object (prototype).  
     * Works like Object.create, but the second argument is simple object, not property descriptor.
     * @param {!Object} obj - Object to clone. Prototype.
     * @param {!object} state - The properties of new, cloned object, should be object literal only ({key:"value"})
     * @param {Object=} behavior$ - The behavior (methods) of new, cloned object)
     */
    function clone(/** !Object */obj, /** !object=object */state, /** Object= */behavior$){
        var newObj = clone2(obj, behavior$ || state || {});
        if(behavior$){
            newObj = clone2(newObj, state);
            if( behavior$.__inits__ ){
                var accessors = behavior$.__inits__;
                for(var key in accessors){
                    clone.defineInitPropertyOf(behavior$, key, accessors[key],
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
    // setup (depends on JavaScript version):
        
    var _prototype;// underscored variables used in closure functions
    if(typeof _globalClone === 'object' && _globalClone.useProto){
        // inject
        _prototype = _globalClone.useProto;
        clone.prototype = _prototype;
    }else{
        _prototype = clone.prototype;
    }
    
    //
    
    var clone2 =      '__proto__' in {}     ? clone_byProto         : clone_byConstructor;
    var define = 'defineProperty' in Object && (typeof(window)==='undefined' || window.XMLHttpRequest)// ie9+ detection
                                            ? Object.defineProperty : shim_definePropertyOf;
    var freeze =         'freeze' in Object ? Object.freeze         : function(){};
    
    // ES5 shim:
    
    if(Object.getPrototypeOf === undefined) Object.getPrototypeOf = 
        function shim_getPrototypeOf(obj){
            // see shim_definePropertyOf
            return obj.hasOwnProperty('__proto__') ? Object.prototype : obj.__proto__;
        };
    
    if(Object.create === undefined) Object.create = 
        function shim_objectCreate(obj, /** Object= */descriptors){
            var newObj = clone(obj);
            for(var key in descriptors){
                define(newObj, key, descriptors[key]);
            }
            return newObj;
        };

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // static methods:

    /** This is link to standart [Object.defineProperty][] function. 
     *  [Object.defineProperty]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
     *  @function
     *  @param obj
     *  @param propertyName
     *  @param descriptor */
    clone.definePropertyOf = define;

    clone.defineInitPropertyOf = function defineInitPropertyOf(
        /** object */obj,
        /** string */propertyName,
        /** function():* */getter,
        /** PropertyDescriptor */descriptor,
        /** PropertyDescriptor */initedDescriptor
    ){
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
    
    clone.defineConstructorOf = function defineConstructorOf(obj, /** string='constructor' */propertyName){
        function InitClone(state){
            for(var key in state) this[key] = state[key];
        }
        InitClone.prototype = obj;
        define(obj, propertyName||'constructor', {value: InitClone, writable:true, configurable:true});
        return InitClone;
    };

    /**
     * Creates new object inherited from clone.prototype.
     * @returns {Object}
     */
    clone.create = function createClone(/** !object=object */state, /** object= */behavior$){
        return clone(rootPrototype, state, behavior$);
    };// clone.bind(null, rootPrototype);

    /** Shoose clone method. Call without parameters to return current method name. */
    clone.by = function cloneBy(/** ('constructor'|'create'|'proto'|'auto')= */method){
        var methods = {
            proto:       _cloneByProto,
            create:      _cloneByObjectCreate,
            constructor: _cloneByConstructor
        };
        if(method){
            if( method === 'auto' ){
                setTimeout(_setCloneMethodByProfiling, 0);
            }else if( methods.hasOwnProperty(method) ){
                _clone = methods[method];
            }else{
                throw new TypeError("Unknown clone method — "+ method);
            }
        }else{
            for(var methodName in methods){
                if( _clone === methods[methodName] ){
                    return methodName;
                }
            }
        }
    }
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // behavior of all created by clone.create objects:
    
    var prototypeMethods = [
        /** 
         * The object-oriented notation of clone function:  
         * For example: `myObject.$clone()` is identical to `clone(myObject)`.
         * @returns {Object}
         * @memberOf clone# */
        function $clone(/** object=object */state, /** object= */behavior$){
            return clone(this, state, behavior$);
        },
        
        /** 
         * 
         * @returns {Object}
         * @memberOf clone# */
        function $extend(/** !object */state, /** object= */behavior$){
            var newBehavior$ = clone(this, state, behavior$);

            //clone.defineConstructorOf(behavior$ || newBehavior$);

            if(behavior$){
                freeze(behavior$);
            }
            freeze(newBehavior$);

            return newBehavior$;
        }
        
//        function $create(/** *= */state, /** ...* */ arg1, arg2, arg3){
//            if( this.$behavior.hasOwnProperty('constructor') ){
//                return new this.constructor(state, arg1, arg2, arg3);
//            }else{
//                return clone2(this, state);
//            }
//        }
    ];
    for(var i=0, sz= prototypeMethods.length; i<sz; i++){
        var method = prototypeMethods[i];
        define(rootPrototype, method.name, {value: method, writable:true, configurable:true});
    }

    return clone; // // // // // // // // // // // // // // // // // // // // //
    // utility functions:

    function clone_byProto(/** !Object */obj, /** !object */state){
        state.__proto__ = obj;
        return state;
    }

    function clone_byConstructor(/** !Object */proto, /** object= */state){
        var  OwnConstructor = state.hasOwnProperty('constructor') && state.constructor.InitClone || state.constructor;
        if(! OwnConstructor || OwnConstructor.name != 'InitClone'){
            try{// to modify OwnConstructor, just warn if error.
                // cache created constructor (if proto does not have own constructor):
                if(OwnConstructor === false){
                    var NewConstructor = clone.defineConstructorOf(proto);
                }else{
                    // cache constructor for objects, that already has custom constructor:
                    NewConstructor = clone.defineConstructorOf(OwnConstructor, 'InitClone');
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
    
    function shim_definePropertyOf(/** !Object */obj, /** string */propertyName, /** !Object */descriptor){
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
    }// // // // // // // // // // // // // // // // // // // // // // // // // // // //
    // module
    
    var _globalClone = global.clone;

    // CommonJS modules (node.js)
    if(typeof module === 'object' && module.exports){
        module.exports = defineModule();

    // AMD
    }else if(typeof define === 'function'){
        define(defineModule);
        
    // Browser
    }else{
        var clone = global.clone = defineModule();
        /**#nocode-*/
        /**
         * For browsers only. Replace `window.clone` by previous value.
         * @returns {clone} function */
        clone.noConflict = function(){
            global.clone = _globalClone;
            return clone;
        }
        /**#nocode+*/
    }
    
}(typeof(window)==='object' && window || global);
/**#nocode-*/