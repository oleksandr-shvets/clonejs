'use strict';
/**
 * @title   clone.js - the true prototype-based JavaScript micro-framework.
 * @version 0.7.0 beta
 * @author  Alex Shvets
 *
 * @class
 * This is the framework that implements the true [prototype-based OOP⠙][1] paradigm in JS. 
 * It's based on the ECMA Script 5 features like [Object.create⠙][2] and [property descriptors⠙][3].
 *    [1]: http://en.wikipedia.org/wiki/Prototype-based_programming
 *    [2]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
 *    [3]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty
 *
 * <p>[View on GitHub](http://github.com/quadroid/clonejs#readme)
 *
 * ### Naming conventions
 *  
 * Var names, **prefixed by "$"**, contain object, used as prototype for other objects.  
 * For example:
 * <code>
 * var $array = Array.prototype, $myType = {},
 *     myTypeInstance = Object.create($myType);// $object.apply($myType, 'create');
 * </code>
 *
 * Properties, **prefixed by "_"**, are private.
 * 
 * [![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)
 *
 * @description
 * The main difference with other class-producing tools like `Ext.define`, `dojo.declare`, `Backbone.Model.extend`
 * is that `$object.clone` will return an object (prototype with defined constructor-function) instead of function
 * (with defined prototype-object). So, you don't need for instantiation, you can just start using the cloned object right now.
 * But, if you need more than one instance, you can create it by `$yourProto.create`.
 *
 * @example
 *
 * var myObj = {a:1, b:2, c:3};
 * var cloneOfMyObj = $object.apply(myObj, 'clone');
 * cloneOfMyObj.a = 11; // myObj.a still == 1
 * myObj.b = 22; // cloneOfMyObj.b will be also changed to 22
 *
 * var $myType = $object.clone({
 *        '(final)          property1': "not configurable and not writable",
 *        '(writable final) property2': "not configurable only",
 *        '(hidden)         property3': "not enumerable",
 *        '(const)           constant': "not writable",
 *                          property4 : "simple property",
 *        '(get)       property3alias': 'property3',// automatically create getter
 *                              _item : "private property (not enumerable)",
 *                       '(get)  item': function() { return this._item },
 *                       '(set)  item': function(v){ this._item = v    },
 *                        constructor : function MyType(){
 *                                          this.applySuper(arguments);
 *                                          // do something...
 *                                      }
 *    });
 * var myTypeInstance = $myType.create({property4: "initialize simple property"});
 * assert( $myType.isPrototypeOf(myTypeInstance) );
 * assert( $myType.property3alias === $myType.property3 );
 *
 * var $myArray1 = $object.clone.call(Array.prototype, {customMethod: function(){}});
 * var $myArray2 = $object.copy(Array).setProperties({customMethod: function(){}});
 *
 */
var $object = /** @lands $object# */{

    /**
     * Create a clone of object.
     * @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create">Object.create⠙</a>
     * @returns {$object}
     * @memberOf $object#
     */
    clone: function(/** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){
        if(arguments.length){
            var descriptors = $object.describe.apply(null, arguments);

            if( descriptors.hasOwnProperty('constructor') ){
                var constructor = descriptors.constructor.value;
                if(typeof constructor == 'string'){
                    var typeName = constructor;
                    constructor = descriptors.constructor.value = function CustomType(){
                        return this.applySuper(arguments);
                    }
                    constructor.typeName = typeName;
                    
                }else if(!constructor.typeName){
                    constructor.typeName = constructor.name || this.constructor.typeName + '_clone';//+n
                }

                constructor.prototype = this;
            }
        }
        return Object.create(this, descriptors);
    },

    /**
     * Use this method to create an instances of prototype objects.  
     * Behaves like a clone method. But, also apply constructor, and, if default constructor called,
     * the created instance will be [sealed⠙][1]. To prevent it, override the constructor. 
     * All arguments will be passed to constructor. 
     * [1]: http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/seal
     * @see $object#clone
     * @see $object#constructor
     * @returns {$object}
     *
     * @example
     *     var $myType = $object.clone({
     *         constructor: 'MyType',
     *     });
     *     var myTypeInstance = $myType.create();
     *     assert( myTypeInstance.constructor === $myType.constructor );
     *     assert( $myType.isPrototypeOf(myTypeInstance) );
     *
     * @memberOf $object#
     */
    create: function(/** Object|...?= */properties, /** PropertyDescriptor= */defaultDescriptor){
        var obj = this.clone();
        return obj.constructor.apply(obj, arguments) || obj;
    },


    /**
     * $object constructor.
     * Override it if you want to create custom type.
     * @field
     * @memberOf $object#
     */
    constructor: function CloneObject(/** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){
        properties && this.defineProperties(properties, defaultDescriptor);

        if( this.constructor === CloneObject ){
            this.seal();
        }
    },

    /**
     * Translate object to property descriptors.
     *
     * For example, `{a:{}, b:2}` will be translated to something like `{a: {value: {}}, b: {value: 2}}`.
     * Functions (except getters) and properties prefixed by "_" will be automatically marked as non-enumerable. 
     *
     * You can prefix your property names by `(get|set|const|final|hidden|writable)`:
     *
     * + `(get)`      - define getter, if string passed, the getter will be auto generated.
     * + `(set)`      - define setter, if string passed, the setter will be auto generated.
     * + `(const)`    - make property unwritable.
     * + `(final)`    - make property unwritable, and prevent it deleting and descriptor modifications.
     * + `(hidden)`   - make property non-enumerable.
     * + `(writable)` - make property writable (use with final).
     *
     * @param properties
     * @param defaultDescriptor The default property descriptor.
     * @returns {{PropertyDescriptor}} Property descriptors.
     * @static
     * @memberOf $object
     */
    describe: function(/** Object */properties, /** PropertyDescriptor= */defaultDescriptor){
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
                //TODO: fix regexp to not mach the '(getset) property'
                var matches = name.match(/^\((((get|set|const|hidden|final|writable) *)+)\) +(.+)$/);
                if( matches ){
                    var prefixes = matches[1].split(' ').sort();
                    name = matches[4];

                    if(descriptors[name]) descriptor = descriptors[name];

                    for(var i in prefixes) switch(prefixes[i]){
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
                if(descriptor.get) value = undefined;// do not allow to hide getter by default
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
    //    if( descriptors.hasOwnProperty('constructor')){
    //        descriptors.constructor.enumerable = false;
    //    }
        return descriptors;
    },
    
    /**
     * Apply method of super object (prototype) to this object.
     * @returns {*}
     * @see $object#__super__
     * @see $object#callSuper
     * @protected
     * @memberOf $object#
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
             * Link to the instance prototype.
             * Dynamically changed to next by prototype chain, while `{@link #applySuper}` method executing.
             * System property. **Use it only for debug purposes**.
             * @name  __super__
             * @type  {?Object}
             * @see $object#applySuper
             * @private
             * @memberOf $object#
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

    /** @see $object#applySuper
     *  @see $object#__super__
     *  @protected
     *  @memberOf $object# */
    callSuper: function(/** string */methodName, /** ?= */ arg1, /** ...?= */argN){
        var args = Array.prototype.slice.call(arguments, 1);
        return this.applySuper(methodName, args);
    },

//        /**
//         * Async safe version of {@link $object#applySuper}.
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
     * Use this method to wrap callback, that can call `{@link #applySuper}` method.
     * @see $object#applySuper
     * @returns {Function}
     * @memberOf $object#
     */
    createSuperSafeCallback: function(/** Function|string */functionOrMethodName, /** Object= */boundThis){
        if(typeof functionOrMethodName == 'string'){
            var fn = this[functionOrMethodName];
            if(typeof boundThis == 'undefined') boundThis = this;
        }else{
            fn = functionOrMethodName;
        }
        //</arguments>

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
     * @param listPrivate Add non-enumerable properties.
     * @returns {$object}
     * @memberOf $object#
     */
    getState: function(/** boolean=false */listPrivate){
        var currentState  = $object.create();
        var ownProperties = listPrivate ? Object.getOwnPropertyNames(this) : Object.keys(this);

        for(var i=0; i < ownProperties.length; i++){var name = ownProperties[i];
            currentState[name] = this[name];
        }
        return currentState;
    },

    /**
     * Return new object, that have a copies of all own properties of this object.  
     * Arguments can be passed in any order (recognized by type).
     * @example
     * var $collection = $object.clone(),
     *     $users = $collection.clone();
     *
     * // $users full prototype chain:
     * $users -> $collection -> $object -> Object.prototype -> null
     *
     * // see prototype chains produced by copy:
     *
     * $users.copy():
     *     ~$users -> $object
     *
     * $users.copy(rootPrototype:Array):
     *     ~$users -> Array.prototype
     *
     * $users.copy(rootPrototype:$parent, parentsLevel:Infinity):
     *     ~$users -> ~$collection -> ~$object -> $parent
     *
     * $users.copy(rootPrototype:$parent, parentsLevel:Infinity, mixParents:true):
     *     ~($users + $collection + $object) -> $parent
     *
     * // where ~$users:
     * New plain object, that have a copy of every own $user property.
     *
     * @param deepMethod
     *        How to process inner objects. Can be:        
     *        "deepCopy"  - see `{@link #deepCopy}`   
     *        "deepClone" - see `{@link #deepClone}`  
     *        "" - do nothing (default).
     *
     * @param rootPrototype
     *        The root prototype for created object prototype chain. If it is Constructor, Constructor.prototype will be used instead.  
     *        By default - $object;
     *
     * @param parentsLevel
     *        How many parents should be included. By default - zero.  
     *        Set this to Infinity if you want to copy all object parents properties up to $object.
     *
     * @param mixParents
     *        Should be false if objects have methods, that call `{@link #applySuper}`.
     *        If true, all own properties of all objects will be directly attached to the one returned object.  
     *        False by default.
     *
     * @returns {Object}
     * @memberOf $object#
     */
    copy: function(
        /** ('deepClone'|'deepCopy')=""      */deepMethod,
        /**     (Object|Constructor)=$object */rootPrototype,
        /**                   number=0       */parentsLevel,
        /**                  boolean=false   */mixParents
        //**                Array=all */propertiesList
    ){
        for(var i=0, value=arguments[i]; i < arguments.length; value=arguments[++i]) switch(typeof value){
            case 'string':   deepMethod    = value; break;
            case 'function': rootPrototype = value.prototype; break;
            case 'object':   rootPrototype = value; break;
            case 'number':   parentsLevel  = value; break;
            case 'boolean':  mixParents    = value; break;
        }

        if( deepMethod != 'deepCopy' || deepMethod != 'deepClone'){
            deepMethod = null;
        }

        if(typeof rootPrototype == 'undefined'){
            rootPrototype = $object;
        }

        var sourceObj = this;
        if( typeof(sourceObj)=='function' && Object.getOwnPropertyNames(sourceObj.prototype) ){
            sourceObj = sourceObj.prototype;
        }
        var newObj    = Object.create(rootPrototype);
        var updateObj = newObj;

        var sourceObjects = [];
        do{
            sourceObjects.push(sourceObj);
            sourceObj = Object.getPrototypeOf(sourceObj);
        }while(parentsLevel-- && sourceObj != Object.prototype);

        sourceObjects = sourceObjects.reverse();

        for(var i=0; i < sourceObjects.length; i++){
            sourceObj = sourceObjects[i];
            var ownPropertyNames = Object.getOwnPropertyNames(sourceObj);
            if (!mixParents && i && ownPropertyNames.length){
                updateObj = $object.apply(updateObj, 'clone');
            }

            // copy all own properties:
            for(var p=0; p < ownPropertyNames.length; p++){
                var name = ownPropertyNames[p];
                var descriptor = Object.getOwnPropertyDescriptor(sourceObj, name);

                if( deepMethod && typeof sourceObj[name] == 'object' && sourceObj[name] !== null){
                    descriptor.value = $object[deepMethod].call(sourceObj[name]);
                }

                Object.defineProperty(updateObj, name, descriptor);
            }
        }

        return updateObj;
    },

    /**
     * Create a copy of this and all inner objects.
     * @see $object#copy
     * @see $object#deepClone
     * @returns {$object}
     * @memberOf $object#
     */
    deepCopy: function deepCopy(){
//        var args = arguments;
//        $object.apply(args, 'unshift',['deepCopy'], Array);
//        return this.copy.apply(this, args);
        var obj = arguments.length ? $object.apply(this, 'copy', arguments) : $object.clone();

        var ownPropertyNames = Object.getOwnPropertyNames(this);
        for(var i=0; i < ownPropertyNames.length; i++){
            var name = ownPropertyNames[i];
            var descriptor = Object.getOwnPropertyDescriptor(this, name);
            if(typeof this[name] == 'object' && this[name] !== null){
                descriptor.value = deepCopy.call(this[name]);
            }
            Object.defineProperty(obj, name, descriptor);
        }

        return obj;
    },

    /**
     * Create a clone of this, and also create a clones of all inner objects.  
     * So, if you modify any inner object of deep clone, it will not affect parent (this) object.  
     * But, if you modify parent (this), it can affect deep clone(s).
     * @see $object#clone
     * @see $object#deepCopy
     * @returns {$object}
     * @memberOf $object#
     */
    deepClone: function deepClone(/** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){
        var obj = $object.apply(this, 'clone', arguments);

        var ownPropertyNames = Object.getOwnPropertyNames(this);
        for(var i=0; i < ownPropertyNames.length; i++){
            var name = ownPropertyNames[i];
            if(typeof this[name] == 'object' && this[name] !== null){
                var descriptor = Object.getOwnPropertyDescriptor(this, name);
                descriptor.value = deepClone.call(this[name]);
                Object.defineProperty(obj, name, descriptor);
            }
        }
        return obj;
    },

    /**
     * Copy properties to other object.
     * @see $object#concat
     * @memberOf $object#
     */
    paste: function(/** Object */pasteTo, /** (Array|boolean)= */allProperties){
        return $object.apply(pasteTo, 'concat', [this, allProperties]);
    },

    /**
     * Copy properties from given object. 
     * If allProperties does not specified, only own properties will be copied.
     * @param obj
     * @param allProperties Array of property names, or `true`. 
     *        If true, all (own and parents) properties will be copied. 
     * @returns {$object} this
     * @see $object#paste
     * @memberOf $object#
     */
    concat: function(/** Object */obj, /** (Array|boolean)= */allProperties){
        if(allProperties == undefined) allProperties = obj.getOwnPropertyNames();
        else if(typeof allProperties != 'object' && allProperties == true){
            allProperties = obj.getOwnPropertyNames();
            var proto = obj;
            while( (proto = Object.getPrototypeOf(proto)) !== Object.prototype ){
                allProperties = allProperties.concat( proto.getOwnPropertyNames() );
            }
        }

        proto = obj;
        do for(var i=0; i < allProperties.length; i++){
            var name = allProperties[i];
            var descriptor = Object.getOwnPropertyDescriptor(proto, name);
            if( descriptor ){
                Object.defineProperty(this, name, descriptor);
                delete allProperties[i];
            }
        }
        while(allProperties.length && (proto = Object.getPrototypeOf(proto)) !== Object.prototype);

        return this;
    },

    /**
     * Apply method from one object to another object.
     * @example
     *     var  args = $object.apply(arguments, 'slice',[1], Array);
     *     var  args = $object.apply.call(Array, arguments, 'slice',[1]);
     * @returns {*}
     * @static
     * @memberOf $object
     */
    apply: function(/** Object */withObj, /** string */methodName, /** Array= */args, /** Object= */asObj){
        if(!asObj){
            asObj = typeof(withObj[methodName])=='function' && withObj[methodName].length == $object[methodName].length && withObj || $object;

        }else if(typeof asObj == 'function' && asObj.prototype){
            asObj = asObj.prototype;
        }

        return asObj[methodName].apply(withObj, args);
    },

    /**
     * Use this to check if method of one object is the same as in the another object.
     * @example
     * var myObj1 = $object.clone({join: function(sep){} });
     * var myObj2 = $object.clone({join: function(){}    });
     * assert( myObj1.can('split').like( Array.prototype ) === true  );
     * assert( myObj2.can('split').like( Array.prototype ) === false );
     * assert( myObj1.can('split').as(   Array.prototype ) === false );
     * assert( $object.can.call(new Array, 'split').as(new Array) === true  );
     *
     * @returns {{like: function(Object):boolean, as: function(Object):boolean}}
     * @memberOf $object#
     */
    can: function(/** string */method, /** number=false */not){
        var obj1 = this;
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
    },

    /**
     * @see $object#can
     * @memberof $object# */
    cant: function(/** string */method){
        return this.can(method, 1);
    },

    /**
     * Returns array of object prototype chain.
     * @returns {Array}
     * @memberof $object#
     */
    getPrototypes: function(/** Object=$object */$last, /** boolean=false */notRevert){
        var prototypes = [];
        var proto = this;
        var pushMethod = notRevert ? 'push' : 'unshift';
        if(typeof $last == 'undefined') $last = $object;
        
        while((proto = Object.getPrototypeOf(proto)) != $last){
            prototypes[pushMethod](proto);
        }
        
        return prototypes;
    },

//    /**
//     * Returns the current state of this object in JSON format.
//     * @see $object#getState
//     * @memberof $object# */
//    toString: function(){
//        return JSON.stringify( this.getState() );
//    },

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

    /** Wrapper for [Object.getPrototypeOf⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
     * @memberof $object# */
    getPrototype: function(){
        return Object.getPrototypeOf(this) },
    /** Wrapper for [Object.keys⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys)
     * @memberof $object# */
    getEnumerableOwnPropertyNames: function(){
        return Object.keys(this) },
    /** Wrapper for [Object.getOwnPropertyNames⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)
     * @memberof $object# */
    getOwnPropertyNames: function(){
        return Object.getOwnPropertyNames(this) },

    /** Wrapper for [Object.preventExtensions⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/preventExtensions)
     * @memberof $object# */
    preventExtensions: function(){
        return Object.preventExtensions(this) },
    /** Wrapper for [Object.isExtensible⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isExtensible)
     * @memberof $object# */
    isExtensible: function(){
        return Object.isExtensible(this) },
    /** Wrapper for [Object.seal⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/seal)
     * @memberof $object# */
    seal: function(){
        return Object.seal(this) },
    /** Wrapper for [Object.isSealed⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isSealed)
     * @memberof $object# */
    isSealed: function(){
        return Object.isSealed(this) },
    /** Wrapper for [Object.freeze⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/freeze)
     * @memberof $object# */
    freeze: function(){
        return Object.freeze(this) },
    /** Wrapper for [Object.isFrozen⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isFrozen)
     * @memberof $object# */
    isFrozen: function(){
        return Object.isFrozen(this) },

    /** Wrapper for [Object.getOwnPropertyDescriptor⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
     * @memberof $object# */
    getOwnPropertyDescriptor: function(/** string */ name){
        return Object.getOwnPropertyDescriptor(this, name);
    },

    /** Define properties.
     *  @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperties">Object.defineProperties⠙</a>
     *  @see $object.describe
     *  @memberof $object# */
    defineProperties: function(/** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){
        return Object.defineProperties(this, $object.describe.apply(null, arguments));
    },

    /** Wrapper for [Object.defineProperty⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty)
     *  @memberof $object# */
    defineProperty: function(/** string */name, /** PropertyDescriptor */propertyDescriptor){
        return Object.defineProperty(this, name, propertyDescriptor);
    }

//    /**
//     *
//     * @memberof $object# */
//    forEach: function(/** function(*,string) */callback, /** Object= */thisArg){
//        for(var name in this){
//            callback.call(thisArg, this[name], name);
//        }
//    },
//
//    /**
//     * Creates a new array with the results of calling a provided function on every enumerable property in this object.
//     * @returns {Array}
//     * @memberof $object# */
//    map: function(/** function(*,string):boolean */callback, /** Object= */thisArg){
//        var result = [];
//        for(var name in this){
//            callback.call(thisArg, this[name], name);
//        }
//        return result;
//    }

//    descriptor: {
//        get configurable(){return Object.isExtensible(this)},
//        set configurable(preventExtensions){ if(preventExtensions) Object.preventExtensions(this) }
//    }

};

// make methods not enumerable:
$object./*re*/defineProperties($object);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * @namespace
 *    The root namespace.
 * @description
 * If you run the following code:
 * <code>
 * ns.extend('collection', {name: 'collection'});
 * ns.collection.extend('arrayCollection', {name: 'arrayCollection'});
 * </code>
 * The structure of the namespace will be:
 * <code>
 * ns == {
 *     $collection: {name: 'collection'},
 *     collection: {
 *         $arrayCollection: {name: 'arrayCollection'},
 *         arrayCollection: {
 *             prototype: {name: 'arrayCollection'},
 *             extend: ns.extend
 *         },
 *         prototype: {name: 'collection'},
 *         extend: ns.extend
 *     },
 *     prototype: $object,
 *     extend: ns.extend,
 *     put: ns.put
 * }
 * </code>
 */
var ns = {
    /** 
     * The prototype of every object in this namespace (default - `{@link $object}`).
     * @name prototype
     * @memberOf ns# */
    prototype: $object,
    
    /**
     * Create prototype as a part of namespace.
     * @see $object#clone
     * @memberOf ns# */
    extend: function extend(/** string */nsName, /** Object */prototype, /** PropertyDescriptor= */defaultDescriptor){
        if( nsName.indexOf('.') > 0 ){
            var currentNS = this;
            var nameParts = nsName.split('.');
            nsName = nameParts.pop();
            nameParts.forEach(function(namePart){
                if(!(namePart in currentNS)){
                    currentNS.extend(namePart);
                }
                currentNS = currentNS[namePart];
            });
        }

        var typeName  = nsName[0].toUpperCase() + nsName.substr(1);
        if(!prototype.hasOwnProperty('constructor')){
            prototype.constructor = typeName;
        }
        var $newProto = $object.isPrototypeOf(prototype) ? prototype : this.prototype.clone(prototype, defaultDescriptor);
        $newProto.constructor.typeName = typeName;
    
        var newNS = {
            prototype: $newProto,
            extend: extend
        };
        this['$'+nsName] =  $newProto;
        this[nsName] = newNS;
        
        return newNS;
    },

    /**
     * Put object (and all its parents) into this namespace.
     * Name will be get from prototype.constructor.name.
     * @returns {ns}
     * @static */
    put: function(/** Object */prototype){
        var eachNS = this;

        var prototypes = prototype.getPrototypes();
        prototypes.push(prototype);
        prototypes.forEach(function(proto){
            var name = proto.constructor.typeName || proto.constructor.name;
            name = name[0].toLowerCase() + name.substr(1);
            if(!(name in eachNS)){
                eachNS.extend(name, proto);
            }
            eachNS = eachNS[name];    
        });
        
        return eachNS;
    }
};

/**
 * @name _global_
 * @namespace
 *  Description of some native types.  
 *  Listed objects does not present in global (window) object, it's only descriptions. 
 */
    if(0)// (need for IDEa code inspections)
    /**
     * Object, that has at least one of the following property:  
     * value, get, set, writable, configurable, enumerable.
     * @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty">Object.defineProperty⠙</a>
     * @name PropertyDescriptor
     * @typedef {({value:*}|{get:{function():*}}|{set:{function(*):void}}|{writable:boolean}|{configurable:boolean}|{enumerable:boolean})} */
    PropertyDescriptor;
    
    /**
     * JavaScript class. Function, that can be called by "new" operator and/or have modified prototype property.  
     * For example: Object, Array, RegExp.
     * @name Constructor
     * @typedef {Function} */


// export ns module:
if(typeof module != 'undefined' && module.exports) module.exports = ns;