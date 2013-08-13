/**#nocode+*/
void function(global){"use strict";
function defineModule(){
/**#nocode-*/
    /** @namespace
     *
     * clone.js - the true prototype-based lazy programming framework.
     * @version v1.1.0-alpha
     * @author  Alex Shvets
     * @see     www.clonejs.org
     *
     * @description 
     * 
     * Create new object, inherited from other object (prototype).  
     * Works like Object.create, but the second argument is simple object, not [propertyDescriptor](_global_.html#propertyDescriptor).
     * @param  obj - Object to clone. Prototype.
     * @param  state - The own properties of created object, should be not a variable, object literal only
     *                 (because it can be modified), for example: `{key:"value"}`.  
     *                 By default — empty object (`{}`), but, if you pass `undefined`, then behavior should be specified.
     * @param  behavior - The behavior (methods) of new object, should be not a variable, object literal only.
     * @returns {Object}
     */
    function clone(/** !Object */obj, /** undefined|!hash=object */state, /** !hash= */behavior){
        if(behavior !== undefined){
            var updatedBehavior = Object.getPrototypeOf(behavior) === obj ? behavior : _clone(obj, behavior);
            if( updatedBehavior.__inits__ ){
                var accessors = updatedBehavior.__inits__;
                for(var key in accessors){
                    clone.defineInitPropertyOf(updatedBehavior, key, accessors[key],
                        {configurable:true},// iteration should not modify object, so, init getter is un-enumerable
                        {configurable:true, writable:true, enumerable:true}
                    );
                }
                delete updatedBehavior.__inits__;
            }
            _define(updatedBehavior, 'parent$', {value: obj, writable:true, configurable:true});
            return state === undefined ? updatedBehavior : _clone(updatedBehavior, state);
//        }else if(obj === Object.prototype){
//            return state||{};
        }else{
            return _clone(obj, state||{});
        }
    }
    
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // setup (depends on JavaScript version):
        
    var _prototype;// underscored variables used in closure functions
    if(typeof _globalClone === 'object' && _globalClone.injectClonePrototypeInto){
        _prototype = _globalClone.injectClonePrototypeInto;
        clone.prototype = _prototype;
        // var clone = {injectClonePrototypeInto: Object.prototype};
    }else{
        _prototype = clone.prototype;
    }

    var jScriptVersion = /**@preserve@cc_on @_jscript_version || @*/0;
        
    var _clone  =      '__proto__' in {}     ? _cloneByProto         : 
                          'create' in Object ? _cloneByObjectCreate  : _cloneByConstructor;
    var _define = 'defineProperty' in Object && (!jScriptVersion || jScriptVersion > 8)
                                             ? Object.defineProperty : _shimDefineProperty;
    var _freeze =         'freeze' in Object ? Object.freeze         : function(){};
    
    //if(_clone !== _cloneByConstructor) setTimeout(_setCloneMethodByProfiling, 0);
    
    // ES5 shim:
    
    if(Object.getPrototypeOf === undefined) Object.getPrototypeOf = 
        function shim_getPrototypeOf(obj){
            // see _shimDefineProperty
            return obj.hasOwnProperty('__proto__') ? clone.prototype : obj.__proto__;
            //return obj.__proto__ === obj ? clone.prototype : obj.__proto__;
        };
    
    if(Object.create === undefined) Object.create = 
        function shim_objectCreate(obj, /** Object= */descriptors){
            var newObj = clone(obj);
            for(var key in descriptors){
                _define(newObj, key, descriptors[key]);
            }
            return newObj;
        };

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // static methods:

    /** This is the link to built-in [Object.defineProperty][] function. 
     *  [Object.defineProperty]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description
     *  @function
     *  @param {!Object} obj
     *  @param {string} propertyName
     *  @param {propertyDescriptor} descriptor */
    clone.definePropertyOf = _define;

    clone.defineInitPropertyOf = function defineInitPropertyOf(
        /** object */obj,
        /** string */propertyName,
        /** function():* */getter,
        /** propertyDescriptor */descriptor,
        /** propertyDescriptor */initedDescriptor
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
//        }else initedDescriptor = _clone(initedDescriptor, {});
//        if( descriptor === undefined){
//            descriptor = {enumerable:false, configurable:true};
//        }else{
//            descriptor = _clone(descriptor, {});
//        }//</arguments>
        descriptor = _clone(descriptor, {
            get: function clone_initGetter(){
                return this[propertyName] = /* <- call setter */getter.call(this, propertyName, initedDescriptor);
            },
            set: function clone_initSetter(value){
                initedDescriptor.value = value;
                _define(this, propertyName, initedDescriptor);
            }
        });
        _define(obj, propertyName, descriptor);
    };
    
    clone.defineConstructorOf = function defineConstructorOf(/** !Object */obj, /** string='constructor' */propertyName){
        //var _parentConstructor = Object.getPrototypeOf(obj).constructor;
        /**
         * Default constructor.
         * @name constructor
         * @function
         * @memberOf clone.prototype */
        function Init(state){
            for(var key in state) this[key] = state[key];
            //_parentConstructor.apply(this, arguments);
        }
        Init.prototype = obj;
        if(!Init.name) Init.name = 'Init';//for IE
        _define(obj, propertyName||'constructor', {value: Init, writable:true, configurable:true});
        return Init;
    };

    /**
     * Creates new object inherited from clone.prototype.
     * @returns {Object}
     */
    clone.create = function createClone(/** !hash=object */state, /** !hash= */behavior){
        return clone(_prototype, state, behavior);
    };// clone.bind(null, _prototype);
    
//    clone.extend = function createBehavior(/** !hash= */state, /** !hash */behavior){
//        return extend.call(_prototype, state, behavior);
//    };
//    var extend = clone.prototype.$extend;
    
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
    
    clone.$call = function(/** Object */obj, /** string */method,/** (...)= */arg1, arg2, arg3, arg4, arg5, arg6, arg7){
        return clone.prototype[method].call(obj, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
    }
    
    clone.$apply = function(/** Object */obj, /** string */method, /** Array= */args){
        return clone.prototype[method].apply(obj, args);
    }
    
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // behavior of all created by clone.create objects:

    var prototypeMethods = {
        /**#@+ @memberOf clone# */

        $clone:
        /** 
         * The object-oriented notation of clone function:  
         * For example: `myObject.$clone()` is identical to `clone(myObject)`.
         * @returns {Object} */
        function $clone(/** hash=object */state, /** !hash= */behavior){
            return clone(this, state, behavior);
        },

        $extend: 
        /** 
         * Creates new type, inherited from this object.  
         * Types should not be modified after creation, so, it's freezed.
         * @returns {prototype$} */
        function $extend(/** !hash= */state, /** !hash */behavior){
            var newPrototype$ = behavior ? clone(this, state, behavior) : clone(this, undefined, state);
            //clone.defineConstructorOf(behavior || newPrototype$);
            _freeze(newPrototype$);
            return  newPrototype$;
        }
        
//        function $create(/** *= */state, /** ...* */ arg1, arg2, arg3){
//            if( this.$behavior.hasOwnProperty('constructor') ){
//                return new this.constructor(state, arg1, arg2, arg3);
//            }else{
//                return _clone(this, state);
//            }
//        }
        /**#@-*/
    };
         
    for(var name in prototypeMethods){
        _define( _prototype, name, {value: prototypeMethods[name], writable:true, configurable:true} );
    }

    clone.defineConstructorOf(_prototype);

//    clone.definePropertyOf(_prototype, 'parent$', {
//        configurable: true,
//        get:('__proto__' in {}) ?
//            function(){return this.__proto__} :
//            function(){return Object.getPrototypeOf(this)}
//    });
         
    // if `clone.prototype` has enumerable properties, do not use it in `clone.create`
    for(var key in _prototype){
        _prototype = Object.prototype; break;
    }
    
    return clone; // // // // // // // // // // // // // // // // // // // // //
    
    /**
     * @name _global_
     * @namespace
     *  Description of some native types.
     *  Listed objects does not present in global (window) object, it's only descriptions.
     */
        /**
         * Object, that has at least one of the following property:
         * `value`, `get`, `set`, `writable`, `configurable`, `enumerable`.
         * @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty">Object.defineProperty⠙</a>
         * @name propertyDescriptor
         * @typedef {({value:*}|{get:{function():*}}|{set:{function(*):void}}|{writable:boolean}|{configurable:boolean}|{enumerable:boolean})} */
        propertyDescriptor;
        //{Object.< 'writable'|'configurable'|'enumerable', boolean= > | Object.<'get'|'set',function> | Object.<'value',?> }
        //{Object.< 'writable'|'configurable'|'enumerable', boolean= > | Object.<'get'|'set'|'configurable'|'enumerable', function|boolean= >}
    
        /**
         * JavaScript class. Function, that can be called by "new" operator and/or have modified prototype property.
         * For example: `Object`, `Array`, `RegExp`.
         * @name Type
         * @typedef {function(...):(object|undefined)} */
        Type;

        /**
         * Simple key-value object, which proto is Object.prototype and all it properties is enumerable.
         * @name hash
         * @typedef {object} */
        hash;    
 
    /**#nocode+*/
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // utility functions:

    function _cloneByProto(/** !Object */obj, /** !hash */state){
        state.__proto__ = obj;
        return state;
    }
    
    function _cloneByObjectCreate(/** !Object */obj, /** !hash */state){
        var newObj = Object.create(obj);
        for(var key in state) newObj[key] = state[key];
        return newObj;
    }

    function _cloneByConstructor(/** !Object */proto, /** hash= */state){
        var  OwnConstructor = state.hasOwnProperty('constructor') && (state.constructor.Init || state.constructor);
        if(! OwnConstructor || OwnConstructor.name != 'Init'){
            try{// to modify OwnConstructor, just warn if error.
                // save (cache) created constructor (if proto does not have own constructor):
                if(OwnConstructor === false){
                    var NewConstructor = clone.defineConstructorOf(proto);
                }else{
                    // cache constructor for objects, that already has custom constructor:
                    NewConstructor = clone.defineConstructorOf(OwnConstructor, undefined, 'Init');
                    //
                    if( OwnConstructor.prototype !== proto){
                        OwnConstructor.prototype = proto;
                    }
                }
                //
//                if( proto.__proto__ !== proto){
//                    proto.__proto__ = proto;
//                }
            }catch(err){
                if(console) console.warn(err);
            }
            OwnConstructor = NewConstructor; 
        }
        return new OwnConstructor(state);
    }
    
    function _shimDefineProperty(/** !Object */obj, /** string */propertyName, /** !propertyDescriptor */descriptor){
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

    function _setCloneMethodByProfiling(/** number= */msec){
        var methods = [_cloneByConstructor, _cloneByObjectCreate
            //,function objInstantiationByNewForIn(obj, state){return new obj.constructor(state)}
        ];
        if( '__proto__' in {} ){
          methods.push(_cloneByProto);
        }

        var bestMethodIdx = 0, bestResult = 0;
        for(var i=0, sz=methods.length; i<sz; i++){
            var result = profile(methods[i], msec||33);
            if( result > bestResult ){
                bestResult = result;
                bestMethodIdx = i;
            }
        }
        
        return _clone = methods[bestMethodIdx];
//        if(console) console.log("Choosing "+ _clone.name);

        function profile(cloneMethod, msec){
            
            var class$ = {a:"string 1", b:{object: 2}, c:3, constructor: function(state){
                for(var key in state) this[key] = this[key];
            }};
            class$.constructor.prototype = class$;
            
            for(var count=0, time=0, startTime = Date.now();
                time < msec;
                ++count % 32 || (time = Date.now() - startTime)// check time every % iterations
            ){
                var obj = cloneMethod(class$, {a:"string", b1:function(){}, c1:3});
            }
            if(console) console.log("Profiling "+ methods[i].name +": ", count, "/", time, "=", count / time);
            return count / time;
        }
    }
        
}
    // // // // // // // // // // // // // // // // // // // // // // // // // // // //
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
