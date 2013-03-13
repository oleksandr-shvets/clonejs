/**
 * @ clone.js - The prototype-based paradigm framework.
 * @version 0.4.5
 * @author  Alex Shvets
 * @see     https://github.com/quadroid/clonejs
 *
 * @class
 *     This class is the library, that have actsent on the new ECMA Script 5 features like Object.create and property descriptors.
 *
 *     <p><b>Naming conventions</b>
 *     <p>Prefix your var names with "$", if it contain prototype object.
 *     <p>
 * @description
 *     If called as function, return a clone of <i>baseObj</i>, and set it's properties.
 *     If called with <i>new</i> operator, constructor will take 2 arguments (properties and defaultDescriptor).
 *
 * @example
 *     var $myType = Clone.make({
 *         constructor: Clone.defineType('MyType', function(){
 *             var obj = this.applySuper(arguments);
 *             // do something with obj...
 *             return obj;
 *         }),
 *         property: 1
 *     });
 *     var myTypeInstance1 = $myType.create();
 *     var myTypeInstance2 = $myType.create();
 *     assert( $myType.isPrototypeOf(myTypeInstance1) );
 *
 *     var $myArray1 = Clone(Array.prototype, {customMethod: function(){}});
 *     var $myArray2 = Clone.makeFomClass(Array, {customMethod: function(){}});
 *
 *
 *     var myObj = {a:1, b:2, c:3};
 *     var cloneOfMyObj = Clone(myObj);
 *     cloneOfMyObj.a = 11; // myObj.a still == 1
 *
 *     var myClone = new Clone();
 *     myClone.defineProperties({a:1, b:2, c:3});
 *
 *     @param {Object} baseObj
 *            Does not used, if called with new operator.
 *
 *     @param {Object=} properties
 *            Own properties of the created object.
 *
 *     @param {PropertyDescriptor=} defaultDescriptor
 *            Default property descriptor for properties.
 *
 * @return {Object} The new clone.
 */
var Clone =
function(){'use strict';

    function Clone(baseObj, /** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){

        if(this && this !== (typeof(global)!=='undefined' && global || window) ){
            // Called as constructor (with new operator or used call/apply):
            // We assume that the new object is already created,
            // and we need only to set its properties (if specified).
            if(arguments.length){
                Array.prototype.unshift.call(arguments, this);
                Function.call.apply(Clone.prototype.defineProperties, arguments);
            }
            return this;

        }else{
        // Called like a regular function:
            if(arguments.length == 0)
                baseObj = Clone.prototype;

            //if(Clone.can(baseObj, 'clone').like(Clone) )

            return Clone.prototype.clone.call(baseObj, properties, defaultDescriptor);
        }

    }

    /**
     * Translate object to property descriptors.
     * <p>For example, {a:{}, b:2} will be translated to something like {a: {value: {}}, b: {value: 2}}.
     * <p>Functions, properties prefixed with "_", and constructor will be automatically marked as non-enumerable.
     *
     * @param {Object} properties
     * @param {PropertyDescriptor=} defaultDescriptor The default property descriptor for properties.
     * @returns {{PropertyDescriptor}} Properties descriptors.
     *
     * @static
     */
    Clone.describe = function(properties, defaultDescriptor){
        var descriptors = {};

        if(!defaultDescriptor){
            /*
             * @typedef {Object}
             * @name PropertyDescriptor */
            defaultDescriptor = {
                value: undefined,
                configurable: true,
                writable: true,
                enumerable: true
            };
        }

        for(var property in properties){
            var value = properties[property];
            var descriptor = descriptors[property] = Object.create(defaultDescriptor);
            descriptor.value = value;

            // methods and private properties should be non-enumerable:
            if(typeof(value)=='function' || property[0]=='_'){
                descriptor.enumerable = false;
            }
        }
        if( descriptors.hasOwnProperty('constructor'))
            descriptors.constructor.enumerable = false;

        return descriptors;
    };


    (function(counter){
    /**
     * Create custom type (class).
     * @param typeName    The name of new type, if no given, constructor.name used, if it empty, the default will be "CustomTypeN".
     * @param prototype   The prototype of new type, if no given, you should manually set the prototype property of returned Function.
     * @param constructor If no given, and if defined prototype.constructor, it used.
     * @returns {FunctionType}
     *
     * @static
     */
    Clone.defineType = function(/** string|*= */typeName, /** Object= */prototype, /** Function= */constructor){
        if(typeof(typeName) != 'string'){
            prototype = typeName;
            typeName = undefined;
        }
        if(typeof(prototype) == 'function'){
            constructor = prototype;
            prototype = constructor.prototype;
        }

        if(!constructor){
            if(prototype && prototype.hasOwnProperty('constructor')){
                constructor = prototype.constructor;
            }else{
                constructor = function(){
                    return this.applySuper(arguments);
                };
            }
        }
        /** @default constructor.name or "CustomTypeN" */
        if(!typeName) typeName = constructor.name || 'CustomType' + counter++;

        //</arguments>

        if( prototype ){
            //prototype.constructor = constructor;
            //constructor.prototype = prototype;
            if(prototype.constructor !== constructor)
                Object.defineProperty(prototype, 'constructor', {value:constructor, writable:!0,configurable:!0});
            if(constructor.prototype !== prototype)
                Object.defineProperty(constructor, 'prototype', {value:prototype,   writable:!0,configurable:!0});
        }

        // store typeName for future use (e.g. debugging):
        Object.defineProperty(constructor, 'typeName', {value:typeName, writable:!0,configurable:!0});

        //global[typeName] = constructor;

        return constructor;
    };

    })(/* counter initial value: */0);

    /**
     * Create new Clone object.
     * @returns {Clone}
     *
     * @static
     */
    Clone.make = function(/** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){
        return Clone.makeFromClass(this, properties, defaultDescriptor);
    };

    /**
     *
     * @returns {~Clone}
     */
    Clone.makeFromClass = function(
        /**        FunctionType */BaseClass,
        /**             Object= */properties,
        /** PropertyDescriptor= */defaultDescriptor
    ){
        var prototype = BaseClass.prototype;

        if(BaseClass instanceof Clone || Clone.can(prototype, 'clone').as(Clone.prototype) ){
            return Clone(prototype, properties, defaultDescriptor);

        }else{

            var newObj = Clone.mix(prototype, Clone.prototype);
            newObj.defineProperties(properties, defaultDescriptor);

            return newObj;
        }
    };

    /**
     * Use this to check if method of one object is the same as in the another object.
     * @example
     *     var myObj = {split: function(){} };
     *     Clone.can(myObj, 'split').like(new Array);
     *
     * @returns {{valueOf: Function, like: function(Object), as: function(Object)}}
     */
    Clone.can = function(/** Object */obj1, /** string */method, /** number=false */not){
        return {
            valueOf: function(){
                // a ^ b == a ? !b : b
                return not ^ typeof( obj1[method] )=='function';
            },

            like: function(obj2){
                var obj2Method = obj2[method];
                return this.valueOf()
                    && not ^ (
                        typeof(obj2Method)=='function' &&
                        obj2Method.length == obj1[method].length
                    );
            },

            as: function(obj2){
                return this.valueOf()
                    && not ^ obj1[method] === obj2[method];
            }
        }
    };
    /** @see Clone.can */
    Clone.cant = function(/** Object */obj1, /** string */method){
        return Clone.can(obj1, method, 1);
    };

    /**
     * Mix two or more objects.
     *
     * @param root
     *        The root object. Will be modified, if copyNesting does not set.
     * @param objectToMix
     *        Object(s) to mix. If it is FunctionType, FunctionType.prototype will be used instead.
     * @param parentsLevel
     *        Set this to Infinity if you want to copy all objectToMix parents properties up to Object.prototype.
     * @param copyNesting
     *        If not true, all properties of all objects will be directly attached to the one root object.
     * @returns {Object} Modified root object if copyNesting, else - the new object based on objectsToMix and root.
     */
    Clone.mix = function(
        /**       Object|FunctionType */root,
        /** Object|FunctionType|Array */objectToMix,
        /**                  number=0 */parentsLevel,
        /**              boolean=true */copyNesting
    ){
        if( typeof(root)=='function' && Object.getOwnPropertyNames(root.prototype) ){
            root = root.prototype;
        }
        if( copyNesting === undefined ){
            if(typeof parentsLevel == 'boolean'){
                copyNesting   = parentsLevel;
                parentsLevel  = 0;
            }else copyNesting = true;
        }

        if(objectToMix instanceof Array){
            mixedObjects = objectToMix;
            //objectToMix = mixedObjects.shift();
        }else{
            // get parents:
            var obj = objectToMix;
            var mixedObjects = [];
            do  mixedObjects.push(obj);
            while( parentsLevel-- && (obj = Object.getPrototypeOf(obj)) != Object.prototype);
        }

        mixedObjects = mixedObjects.reverse();

        var updateObj = root;

        for(var objIdx in mixedObjects){
            obj = mixedObjects[objIdx];

            if( typeof(obj)=='function' && Object.getOwnPropertyNames(obj.prototype) ){
                obj = obj.prototype;
            }

            var ownPropertyNames = Object.getOwnPropertyNames(obj);

            if(copyNesting && ownPropertyNames.length){
                updateObj = Clone(updateObj);
            }

            // copy all own properties from obj to updateObj:
            for(var i=0; i < ownPropertyNames.length; i++){
                var name = ownPropertyNames[i];
                var descriptor = Object.getOwnPropertyDescriptor(obj, name);
                Object.defineProperty(updateObj, name, descriptor);
            }
        }

        return updateObj;
    };

    //Clone.defineType('Clone', Clone.makeFomClass(Object,
    Object.defineProperties(Clone.prototype, Clone.describe(
        /** @lands Clone.prototype */{

        /**
         * Override it if you want to create custom type:
         * @example
         *     var $myType = new Clone({
         *         constructor: Clone.defineType('MyType'),
         *     });
         *     var myTypeInstance = $myType.create();
         *     assertTrue( myTypeInstance.constructor === $myType.constructor );
         *     assertTrue( $myType.isPrototypeOf(myTypeInstance) );
         *
         * @see Clone.defineType
         * @type {Function}
         * @constructs Clone
         */
        constructor: Clone,
    //    get constructor(){
    //        var self = this;
    //
    //        var Constructor = Clone.defineType('', this);
    //
    //        this.defineProperty('constructor', {
    //            value: Constructor
    //        });
    //
    //        return Constructor;
    //    },

        /**
         * Create a clone of this. See {@link Object.create} for details.
         * @see Clone
         * @see Object.create
         * @returns {Clone}
         */
        clone: function(/** Object= */properties, /** Object= */defaultDescriptor){
            if(arguments.length){
                var ownPropertiesDescriptors = Clone.describe.apply(null, arguments);

                if( ownPropertiesDescriptors.hasOwnProperty('constructor') ){
                    ownPropertiesDescriptors.constructor.value.prototype = this;
                }
            }
            return Object.create(this, ownPropertiesDescriptors);
        },

        /**
         * Use this method to create an instances of prototype ($uper) objects.
         * <p>Behaves like a clone method, but also call constructor.
         * And, the created instance are sealed: to prevent it, override the create method.
         * @returns {Clone}
         */
        create: function(/** ...? */){
            var newObj = this.clone();
            newObj = this.constructor.apply(newObj, arguments) || newObj;
            newObj.seal();//ToDo: maybe, move this to constructor? (if constructor === this.constructor)
            return newObj;
    //        return/* if */(this.constructor !== Clone)
    //            &&/* then return: */ this.constructor.apply(newObj, arguments) /*(if not void)*/
    //            ||/* else return: */ newObj;
        },

        /**
         * Apply method of super object to this object.
         * @returns {*}
         */
        applySuper: function(/** string=constructor|Array */ methodName, /** Array= */args){
            if(typeof(methodName) != 'string'){
                if( arguments[0] instanceof Array){
                    args = arguments[0];
                }
                methodName = 'constructor';
            }//</arguments>

            /* if not */('__super__' in this) || this.defineProperty(
                '__super__', {value: Object.getPrototypeOf(Object.getPrototypeOf(this)), writable:!0,configurable:!0}
            );

            // save super
            var savedSuper = this.__super__;
            // set super to next by prototype chain, in case if method also call applySuper
            this.__super__ = Object.getPrototypeOf(savedSuper);
            // apply method
            var returned   = savedSuper[methodName].apply(this, args);
            // restore super
            this.__super__ = savedSuper;

            return returned;
        },

        /** @see Clone.prototype.applySuper */
        callSuper: function(/** string */methodName, /** ?= */ arg1, /** ?= */argN){
            var args = Array.prototype.slice.call(arguments, 1);
            return this.applySuper(methodName, args);
        },

//        /**
//         * Async safe version of {@link Clone.prototype.applySuper}.
//         * @param {string} methodName
//         * @param {Array} args
//         * @param {...number=} callbackArgIdx1 Indexes of arguments, that is a callbacks, that can call applySuper.
//         *     Default value is the last arg index.
//         * @param callbackArgIdxN
//         * @returns {*}
//         */
//        applySuperAsync: function(methodName, args, /** number=`args.length-1` */callbackArgIdx1, /** number= */callbackArgIdxN){
//            if( callbackArgIdx1===undefined)
//                callbackArgIdx1 = args.length - 1;
//
//            var safeArgs = new Array(args.length);
//            var indexOf = Array.prototype.indexOf;
//            for(var i=0; i < args; i++){
//                safeArgs[i] = indexOf.call(arguments, i, 2+i) ? this.createSuperSafeCallback(args[i]) : args[i];
//            }
//
//            return this.applySuper(methodName, safeArgs);
//        },

        /**
         * Use this method to wrap callback, that can call "applySuper" method.
         * @see Clone.prototype.applySuper
         * @returns {Function}
         */
        createSuperSafeCallback: function(/** Function|string */fnOrMethodName, /** Object= */boundThis){
            if(typeof fnOrMethodName == 'string'){
                var fn = this[fn];
                boundThis = this;
            }else{
                fn = fnOrMethodName;
            }

            var self = this;
            var callbackSuper = this.__super__;

            return function superSafeCallback(){

                if(self.__super__ === callbackSuper){
                    return fn.apply(boundThis||this, arguments);

                }else{
                    var savedSuper = self.__super__;
                    self.__super__ = callbackSuper;
                    var returned   = fn.apply(boundThis||this, arguments);
                    self.__super__ = savedSuper;

                    return returned;
                }
            }
        },

        /**
         * Returns all changed properties, since cloning of object.
         * Separate object from its prototype and return it.
         * @returns {Clone}
         */
        getState: function(/** boolean=false */listPrivate){
            var currentState  = new Clone;
            var ownProperties = Object.getOwnPropertyNames(this);

            if(listPrivate){
                for(var i=0; i < ownProperties.length; i++){var name = ownProperties[i];
                    currentState[name] = this[name];
                }
            }else{
                for(var i=0; i < ownProperties.length; i++){var name = ownProperties[i];
                    if(this.propertyIsEnumerable(name) )
                        currentState[name] = this[name];
                }
            }

            return currentState;
        },

        /**
         * Mix this object with another.
         * @see Clone.mix */
        mixWith: function(/** Object|FunctionType */mixinObject, /** number=0 */parentsLevel){
            Clone.mix(this, mixinObject, 0,false);
        },

        /**
         * Returns the current state of this object in JSON format.
         * @see Clone.prototype.getState */
        toString: function(){
            return JSON.stringify( this.getState() );
        },

//        /**
//         * Returns true if all enumerable properties of this present in obj.
//         * @returns {boolean}
//         */
//        looksLike: function(/** Object */obj){
//            for(var  p in this){
//                if(!(p in obj))
//                    return false;
//            }
//            return true;
//        },
//        /**
//         * Returns true if all methods of this present in obj.
//         * @returns {boolean}
//         */
//        behavesLike: function(/** Object */obj){
//            var propertyNames = this.getOwnPropertyNames();
//            for(var i= 0; i < propertyNames.length; i++){var name = propertyNames[i];
//                if(name[0]!=='_'){
//                    var property = this[name];
//                    if(typeof(property)=='function'){
//                        var objProperty = obj[name];
//
//                        if(typeof(objProperty)!='function') return false;
//                        if(objProperty.length != property.length) return false;
//                    }
//                }
//            }
//            return true;
//        },

        // Some sugar:

        /** @see Object.getPrototypeOf */
        getPrototype: function(){
            return Object.getPrototypeOf(this) },
        /** @see Object.keys */
        getEnumerableOwnPropertyNames: function(){
            return Object.keys(this) },
        /** @see Object.getOwnPropertyNames */
        getOwnPropertyNames: function(){
            return Object.getOwnPropertyNames(this) },

        /** @see Object.preventExtensions */
        preventExtensions: function(){
            return Object.preventExtensions(this) },
        /** @see Object.isExtensible */
            isExtensible: function(){
            return Object.isExtensible(this) },
        /** @see Object.seal */
        seal: function(){
            return Object.seal(this) },
        /** @see Object.isSealed */
            isSealed: function(){
            return Object.isSealed(this) },
        /** @see Object.freeze */
        freeze: function(){
            return Object.freeze(this) },
        /** @see Object.isFrozen */
            isFrozen: function(){
            return Object.isFrozen(this) },

        /** @see Object.getOwnPropertyDescriptor */
        getOwnPropertyDescriptor: function(/** string */propertyName){
            return Object.getOwnPropertyDescriptor(this, propertyName);
        },

        /** @see Object.defineProperties
         *  @see Clone.describe */
        defineProperties: function(/** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){
            return Object.defineProperties(this, Clone.describe.apply(null, arguments));
        },

        /** @see Object.defineProperty */
        defineProperty: function(/** string */name, /** PropertyDescriptor */propertyDescriptor){
            return Object.defineProperty(this, name, propertyDescriptor);
        }

    //    descriptor: {
    //        get configurable(){return Object.isExtensible(this)},
    //        set configurable(preventExtensions){ if(preventExtensions) Object.preventExtensions(this) }
    //    }

    }));

    Clone.defineType('Clone', Clone);

    //nodejs:
    if(typeof(module)!='undefined' && module.exports) module.exports = Clone;

    return Clone;
    //unreachable code, for jsdoc:

    /**
     * Object, that has at least one of the following property: <br>
     * value, get, set, writable, configurable, enumerable.
     * @typedef {({value:*}|{get:{function():*}}|{set:{function(*):void}}|{writable:boolean}|{configurable:boolean}|{enumerable:boolean})} */
     PropertyDescriptor = Object;

    /**
     *
     * @typedef {Function} */
     FunctionType = Function;

}();