'use strict';
/**
 * @title   clone.js - The true prototype-based OOP framework.
 * @version 0.5.1
 * @author  Alex Shvets
 * @see     https://github.com/quadroid/clonejs
 *
 * @class
 *     This is the framework that implements the true prototype-based OOP paradigm in JS.
 *     It based on the new ECMA Script 5 features like Object.create and property descriptors.
 *
 *     <p><b>Naming conventions</b>
 *     <p><b>Var names, prefixed by "$"</b>, contain object, used as prototype for other objects. For example:<br>
 *        var $array = Array.prototype, $myType = {}, <br>
 *            myTypeInstance = Clone($myType);
 *     <p>
 *     <p><b>properties, prefixed by "_"</b>, are private.
 *     <p>
 * @description
 *     If called as function, return a clone of <i>baseObj</i>, and set it's own properties.
 *     If called by <i>new</i> operator, constructor will take no more than 2 arguments (properties and defaultDescriptor).
 *
 * @example
 *     var $myType = Clone.make({
 *         constructor: Clone.defineType('MyType', function(){
 *             this.applySuper(arguments);
 *             // do something...
 *         }),
 *         _item: null,//private property (not enumerable)
 *         '(get) item': function(){return this._item},
 *         '(set) item': function(v){this._item = v},
 *         '(get) publicPropertyAlias': 'publicProperty',
 *         '(const) constant': 'not writable',
 *         '(final) notConfigurableAndNotWritable': true,
 *         '(hidden) notEnumerable': true,
 *         '(writable final) notConfigurableOnly': null,
 *         '(hidden final get) notEnumerableGetter': function(){},
 *         publicProperty: 1
 *     });
 *     var myTypeInstance = $myType.create();
 *     assert( $myType.isPrototypeOf(myTypeInstance) );
 *
 *     var $myArray1 = Clone(Array.prototype, {customMethod: function(){}});
 *     var $myArray2 = Clone.makeFom(Array, {customMethod: function(){}});
 *
 *     var myObj = {a:1, b:2, c:3};
 *     var cloneOfMyObj = Clone(myObj);
 *     cloneOfMyObj.a = 11; // myObj.a still == 1
 *
 *     var myClone = new Clone();
 *     myClone.defineProperties({a:1, b:2, c:3});
 *
 *     @param {Object} baseObj
 *            Does not used, if called by new operator.
 *
 *     @param {Object=} properties
 *            Own properties of the created object.
 *
 *     @param {PropertyDescriptor=} defaultDescriptor
 *            Default property descriptor for properties.
 *
 * @return {Object} The new clone.
 */
var Clone = function Clone(baseObj, /** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){

    if(this && this !== (window || global) ){
    // Called as constructor (by new operator or used call/apply):
        // We assume that the new object is already created,
        // and we need only to set its own properties (if specified).
        if(arguments.length){
            Array.prototype.unshift.call(arguments, this);
            Function.call.apply(Clone.prototype.defineProperties, arguments);
        }
        return this;// need for call/apply

    }else{
    // Called like a regular function:
        if(arguments.length == 0) baseObj = Clone.prototype;

        return Clone.prototype.clone.call(baseObj, properties, defaultDescriptor);
    }
};

/**
 * Translate object to property descriptors.
 * <p>For example, {a:{}, b:2} will be translated to something like {a: {value: {}}, b: {value: 2}}.
 * <p>Functions (except getters and setters), properties prefixed by "_", and constructor will be automatically marked as non-enumerable.
 * <p>You can prefix your property names by (get|set|const|final|hidden|writable).
 *     <li>(get) - define getter, if string passed, the getter will be auto generated.
 *     <li>(set) - define setter, if string passed, the setter will be auto generated.
 *     <li>(const) - make property unwritable.
 *     <li>(final) - make property unwritable, and prevent it deleting and descriptor modifications.
 *     <li>(hidden) - make property non-enumerable.
 *     <li>(writable) - make property writable (use with final).
 *
 * @param {Object} properties
 * @param {PropertyDescriptor=} defaultDescriptor The default property descriptor.
 * @returns {{PropertyDescriptor}} Property descriptors.
 *
 * @static
 */
Clone.describe = function(properties, defaultDescriptor){
    var descriptors = {};

    var $defaultDescriptor = defaultDescriptor ? defaultDescriptor : {
        configurable: true,
        enumerable: true,
        writable: true
    };

    var hidingAllowed = !(defaultDescriptor && defaultDescriptor.enumerable);

    for(var name in properties){
        var value = properties[name];
        var descriptor = Object.create($defaultDescriptor);

        if( name[0]=='(' ){
            var matches = name.match(/^\((((get|set|const|hidden|final|writable) *)+)\) +(.+)$/);
            if( matches ){
                var prefixes = matches[1].split(' ').sort();
                name = matches[4];

                if(descriptors[name]) descriptor = descriptors[name];

                for(var prefix in prefixes) switch(prefix){
                    case    'const': descriptor.writable     = false; break;
                    case    'final': descriptor.configurable = false; descriptor.writable = false; break;
                    case      'get': descriptor.get          = value; break;
                    case   'hidden': descriptor.enumerable   = false; break;
                    case      'set': descriptor.set          = value; break;
                    case 'writable': descriptor.writable     = true;  break;
                }
            }
        }

        if(descriptor.get || descriptor.set){
            if(typeof value == 'string'){
                var hiddenPropertyName = value;
                if(typeof descriptor.get == 'string'){
                    descriptor.get = function getter(){
                        return this[hiddenPropertyName];
                    }
                }else{
                    descriptor.set = function setter(newValue){
                        this[hiddenPropertyName] = newValue;
                    }
                }
            }
            descriptor.value = undefined;
            value = undefined;// do not allow to hide getters/setters by default
        }else{
            descriptor.value = value;
        }

        // hide methods and private properties:
        if(hidingAllowed && typeof(value)=='function' || name[0]=='_'){
            descriptor.enumerable = false;
        }
//        // constants:
//        if(name.toUpperCase() == name){
//            descriptor.writable = false;
//        }
        descriptors[name] = descriptor;
    }
    if( descriptors.hasOwnProperty('constructor')){
        descriptors.constructor.enumerable = false;
    }
    return descriptors;
};


(function(counter){
/**
 * Create custom Type (JS class).
 * @param name        The name of new type, if no given, constructor.name used, if it empty, the default will be "CustomTypeN".
 * @param prototype   The prototype of new type, if no given, you should manually set the prototype property of returned Function.
 * @param constructor If no given, and if defined prototype.constructor, it used.
 * @returns {FunctionType}
 *
 * @static
 */
Clone.defineType = function(/** string|*=CustomTypeN */name, /** Object= */prototype, /** Function= */constructor){
    if(typeof(name) != 'string'){
        prototype = name;
        name = undefined;
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

    if(!name) name = constructor.name || 'CustomType' + counter++;

    //</arguments>

    if( prototype ){
        //prototype.constructor = constructor;
        //constructor.prototype = prototype;
        if(prototype.constructor !== constructor)
            Object.defineProperty(prototype, 'constructor', {value:constructor, writable:!0,configurable:!0});
        if(constructor.prototype !== prototype)
            Object.defineProperty(constructor, 'prototype', {value:prototype,   writable:!0,configurable:!0});
    }

    // store name for future use (e.g. debugging):
    Object.defineProperty(constructor, 'typeName', {value:name, writable:!0,configurable:!0});

    //global[name] = constructor;

    return constructor;
};

})(/* counter initial value: */0);

/**
 * Create new Clone object.
 * @returns {Clone}
 */
Clone.make = function(/** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){
    return new Clone(properties, defaultDescriptor);
};

/**
 * Create new object, inherited from parent, and have all properties from Clone.prototype.
 * @returns {Object|Clone}
 */
Clone.makeFrom = function(
    /** FunctionType|Object */parent,
    /**             Object= */properties,
    /** PropertyDescriptor= */defaultDescriptor
){
    var prototype = parent.prototype || parent;

    if( Clone.prototype.isPrototypeOf(prototype)
        || Clone.can(prototype, 'clone').as(Clone.prototype)
        || prototype === Clone.prototype
    ){
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
        /** @ignore *///jsdoc3
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
 *        The root object. Will be modified, if copyNesting does not true.
 *
 * @param objectToMix
 *        Object(s) to mix. If it is FunctionType, FunctionType.prototype will be used instead.
 *
 * @param parentsLevel
 *        Set this to Infinity if you want to copy all objectToMix parents properties up to Object.prototype.
 *
 * @param copyNesting
 *        Should be true if objectsToMix have methods, that call {@link Clone#applySuper}
 *        If not true, all own properties of all objects will be directly attached to the one root object.
 *
 * @returns {Object} Modified root object if copyNesting, else - the new object based on objectsToMix copies and root.
 */
Clone.mix = function(
    /** Object|FunctionType */root,
    /** Object|FunctionType|Array.<(Object|FunctionType)> */
                              objectToMix,
    /**            number=0 */parentsLevel,
    /**        boolean=true */copyNesting
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Object.defineProperties(Clone.prototype, Clone.describe(
    /** @lands Clone.prototype */{

    /**
     * Override it if you want to create custom type:
     * @example
     *     var $myType = new Clone({
     *         constructor: Clone.defineType('MyType'),
     *     });
     *     var myTypeInstance = $myType.create();
     *     assert( myTypeInstance.constructor === $myType.constructor );
     *     assert( $myType.isPrototypeOf(myTypeInstance) );
     *
     * @see Clone.defineType
     * @type {Function}
     * @memberOf Clone#
     */
    constructor: Clone,
//    get constructor(){
//        var self = this;
//
//        var Type = Clone.defineType('', this);
//
//        this.defineProperty('constructor', {
//            value: Type
//        });
//
//        return Type;
//    },

    /**
     * Create a clone of this. See <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create">Object.create</a> for details.
     * @see Clone
     * @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create">Object.create</a>
     * @returns {Clone}
     * @memberof Clone#
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
     * Use this method to create an instances of prototype objects.
     * <p>Behaves like a clone method, but also call constructor.
     * And, the created instance are sealed (<a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/seal">Object.seal</a>): to prevent it, override the create method.
     * @see Clone#clone
     * @see Clone#constructor
     * @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/seal">Object.seal</a>
     * @returns {Clone}
     * @memberof Clone#
     */
    create: function(/** ...?= */constructorArguments){
        var newObj = this.clone();
        newObj = this.constructor.apply(newObj, arguments) || newObj;
        newObj.seal();//ToDo: maybe, move this to constructor? (if constructor === this.constructor)
        return newObj;
//        return/* if */(this.constructor !== Clone)
//            &&/* then return: */ this.constructor.apply(newObj, arguments) /*(if not void)*/
//            ||/* else return: */ newObj;
    },

    /**
     * Apply method of super object (prototype) to this object.
     * @returns {*}
     * @memberof Clone#
     */
    applySuper: function(/** string='constructor'|Array */ methodName, /** Array= */args){
        if(typeof(methodName) != 'string'){
            if( arguments[0] instanceof Array){
                args = arguments[0];
            }
            methodName = 'constructor';
        }//</arguments>

        /* if not */('__super__' in this) || this.defineProperty(
            '__super__', {value: Object.getPrototypeOf(Object.getPrototypeOf(this)), writable:!0,configurable:!0}
            /**
             * Link to the object prototype.
             * Dynamically changed to next (by prototype chain), while applySuper method run.
             * System property. <b>Use it only for debug purposes</b>.
             * @name  __super__
             * @type  {?Object}
             * @see Clone#applySuper
             * @memberOf Clone#
             */
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

    /** @see Clone#applySuper
     *  @memberof Clone# */
    callSuper: function(/** string */methodName, /** ?= */ arg1, /** ...?= */argN){
        var args = Array.prototype.slice.call(arguments, 1);
        return this.applySuper(methodName, args);
    },

//        /**
//         * Async safe version of {@link Clone#applySuper}.
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
     * @see Clone#applySuper
     * @returns {Function}
     * @memberof Clone#
     */
    createSuperSafeCallback: function(/** Function|string */functionOrMethodName, /** Object= */boundThis){
        if(typeof functionOrMethodName == 'string'){
            var fn = this[functionOrMethodName];
            if(typeof boundThis == 'undefined') boundThis = this;
        }else{
            fn = functionOrMethodName;
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
     * Returns all changed properties, since cloning of object.<br>
     * Separate object from its prototype and return it.<br>
     * Private meens non-enumerable properties.
     * @returns {Clone}
     * @memberof Clone#
     */
    getState: function(/** boolean=false */listPrivate){
        var currentState  = new Clone;
        var ownProperties = listPrivate ? Object.getOwnPropertyNames(this) : Object.keys(this);

        for(var i=0; i < ownProperties.length; i++){var name = ownProperties[i];
            currentState[name] = this[name];
        }

        return currentState;
    },

    /**
     * Mix this object with another.
     * @see Clone.mix
     * @memberof Clone# */
    mixWith: function(/** Object|FunctionType */mixinObject, /** number=0 */parentsLevel){
        Clone.mix(this, mixinObject, parentsLevel, false);
    },

    /**
     * Returns the current state of this object in JSON format.
     * @see Clone#getState
     * @memberof Clone# */
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

    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getPrototypeOf">Object.getPrototypeOf</a>
     * @memberof Clone# */
    getPrototype: function(){
        return Object.getPrototypeOf(this) },
    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys">Object.keys</a>
     * @memberof Clone# */
    getEnumerableOwnPropertyNames: function(){
        return Object.keys(this) },
    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames">Object.getOwnPropertyNames</a>
     * @memberof Clone# */
    getOwnPropertyNames: function(){
        return Object.getOwnPropertyNames(this) },

    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/preventExtensions">Object.preventExtensions</a>
     * @memberof Clone# */
    preventExtensions: function(){
        return Object.preventExtensions(this) },
    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isExtensible">Object.isExtensible</a>
     * @memberof Clone# */
        isExtensible: function(){
        return Object.isExtensible(this) },
    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/seal">Object.seal</a>
     * @memberof Clone# */
    seal: function(){
        return Object.seal(this) },
    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isSealed">Object.isSealed</a>
     * @memberof Clone# */
        isSealed: function(){
        return Object.isSealed(this) },
    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/freeze">Object.freeze</a>
     * @memberof Clone# */
    freeze: function(){
        return Object.freeze(this) },
    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isFrozen">Object.isFrozen</a>
     * @memberof Clone# */
        isFrozen: function(){
        return Object.isFrozen(this) },

    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor">Object.getOwnPropertyDescriptor</a>
     * @memberof Clone# */
    getOwnPropertyDescriptor: function(/** string */ name){
        return Object.getOwnPropertyDescriptor(this, name);
    },

    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperties">Object.defineProperties</a>
     *  @see Clone.describe
     *  @memberof Clone# */
    defineProperties: function(/** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){
        return Object.defineProperties(this, Clone.describe.apply(null, arguments));
    },

    /** @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty">Object.defineProperty</a>
     *  @memberof Clone# */
    defineProperty: function(/** string */name, /** PropertyDescriptor */propertyDescriptor){
        return Object.defineProperty(this, name, propertyDescriptor);
    }

//    descriptor: {
//        get configurable(){return Object.isExtensible(this)},
//        set configurable(preventExtensions){ if(preventExtensions) Object.preventExtensions(this) }
//    }

}));

Clone.defineType('Clone', Clone);

//export for nodejs:
if(typeof(module)!='undefined' && module.exports) module.exports = Clone;

if(0)//need for IDEA code inspections
/**
 * Object, that has at least one of the following property: <br>
 * value, get, set, writable, configurable, enumerable.
 * @name PropertyDescriptor
 * @typedef {({value:*}|{get:{function():*}}|{set:{function(*):void}}|{writable:boolean}|{configurable:boolean}|{enumerable:boolean})} */
PropertyDescriptor;

/**
 * JavaScript class. Function, that can be called by "new" operator and/or have modified prototype property.
 * @name FunctionType
 * @typedef {Function} */