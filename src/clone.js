/**#nocode+*/
(function(global){"use strict";
/**#nocode-*/
/**
 * @name    Clone
 * @title   clone.js - the true prototype-based JavaScript micro-framework.
 * @version v1.0.0-alpha
 * @author  Alex Shvets
 *
 * @class
 * This is the framework that implements the true prototype-based paradigm in JS.  
 *
 * <p>[View on GitHub](http://github.com/quadroid/clonejs#readme)
 *
 * ### Naming conventions
 *
 * Variable names, **prefixed by "$"**, contain object, used as prototype for other objects. 
 * For example:
 * <code>
 * var $array = Array.prototype, $myType = {},
 *     myTypeInstance = Object.create($myType);
 * </code>
 *
 * Properties, **prefixed by _**, are private.
 *   
 * Strings, quoted by **'single' quotes**, are identifiers, like ruby's colon (:).
 * If you use [reflection], please follow this rule.
 * [reflection]: http://en.wikipedia.org/wiki/Reflection_(computer_programming)
 * 
 *    /// Without reflection
 *        new Foo().hello()
 *    
 *    /// With reflection
 *    
 *    // assuming that Foo resides in this
 *        new this['Foo']()['hello']()
 *    
 *    // or without assumption
 *        new (eval('Foo'))()['hello']()
 * 
 * [![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)
 *
 */
function Clone(/** *= */obj, /** (boolean|string)= */booleanFullInitOrStringMethod, /** Array= */methodArgs, /** Object=object */methodOwner){
    var objType = typeof obj;
//    var object = Clone.prototype;
    var newOperatorUsed = this && this !== global/*instanceof object*/;

    if(arguments.length == 1){

        if(objType === 'function'){

            /// return /// prototype:
            return obj.prototype;

        }else if(objType === 'object'){
            
            if(Object.getPrototypeOf(obj) === Object.prototype){// if object literal passed
                /// return /// clone of object:
                if( newOperatorUsed ){
                    this.setState(obj, false, booleanFullInitOrStringMethod);
                    return this;
                }else{
                    return object.clone(obj);                        
//                    return new Clone(obj);                        
                }
                
            }else{// if other (not simple/literal) object passed

                if( obj instanceof Clone /* obj cloned */ 
                ||  obj.describe && obj.describe === object.describe /* obj "clonified" */
                ){
                /// return /// unmodified object:
                    return obj;

                /// return /// "clonified" object:    
                }else if( '__proto__' in Object.prototype ){
                    // method 1: redefine last proto (warning! will modify top parent prototype)
                    _(obj, 'getPrototypes',[null])[0].__proto__ = object;
                    return obj;
                }else{
                    // method 2: mix in object
                    object.paste(obj);
                    delete obj.constructor;
                    obj.defineType();
                    return obj;
                }
            }
        }else{// argument type is not object or function
            /// return /// object wrapper for native value:
            return Object(obj);
        }
        
    }else if(arguments.length > 1){
        
        /// Call method ///
        if( objType == 'function' ){
            // make possible: $$(Array, 'extend',[{}])
            obj = obj.prototype;
        }
        return (obj[booleanFullInitOrStringMethod] || (methodOwner || object)[booleanFullInitOrStringMethod]).apply(obj, methodArgs);
        
    }else{// no args passed
        
        return newOperatorUsed ? this : object.clone();
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var _ = Clone;

var object = /** @lands object# */{
    /**
     * Default object constructor. Override it if you want to create custom type.
     * @see object#create
     * @this {Object} Instance only.
     * @memberOf object#
     */
    constructor: Clone,

    /**
     * Create a clone of object: just creates new object, and sets it's `__proto__` to object.
     * If you need a full copy of object, use #copy method instead.
     * @see object.describe
     * @see #copy
     * @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create">Object.create⠙</a>
     * @example
     *     var $myProto = {a:1, b:2, c:3};
     *     var    clone = object.clone.apply($myProto);
     *          clone.a = 11; // $myProto.a still == 1
     *       $myProto.b = 22; // clone.b will be also changed to 22
     * @this {Object} Prototype or instance.
     * @returns {object}
     * @memberOf object#
     */
    clone: function(/** Object= */defineFields, /** PropertyDescriptor= */defaultDescriptor, /** boolean= */checkFinal){
        if(arguments.length){
            var descriptors = _(this, 'describe', arguments);
        }
        return Object.create(this, descriptors);
    },
    
    /**
     * @see object#clone
     * @see object.describe
     * @this {Object} Prototype.
     * @returns {object} Prototype.
     * @memberOf object#
     */
    extend: function(/** string= **/typeName, /** Object= */defineFields, /** PropertyDescriptor= */defaultDescriptor){
        var prototype = this;
        
        if(typeof typeName === 'string'){
            var args = _(arguments, 'slice',[1], Array);
        }else{
            args = arguments;
            typeName = undefined;
        }
        // </arguments>
        
        _(args,'push',[/* checkFinal = */true], Array);
        
        var  newProto = _(prototype, 'clone', args);
        
        if(! newProto.hasOwnProperty('constructor') ){
             _(newProto, 'defineType',[typeName]);
        }
        
        // Prevent hidden classes creation: 
        Object.seal(newProto);
        
        return newProto;
    },

    /**
     * Use this method to create an instances of prototype objects.  
     * Creates a [clone](#clone) of object, and also apply [constructor][1]<!--, and,
     * the created instance will be [sealed⠙][2] to avoid creation of [hidden classes⠙][3]-->.  
     * All arguments, passed to `create()`, will be forwarded to [constructor][1].
     * [1]: #constructor
     * [2]: http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/seal
     * [3]: https://developers.google.com/v8/design#prop_access
     * @see object#clone
     * @see object#constructor
     * @this {object|Object} Prototype.
     * @returns {object|Object}
     *
     * @example
     *     var myType = object.extend('MyType');
     *     var myTypeInstance = myType.create();
     *     assert( myTypeInstance.constructor === myType.constructor );
     *     assert( myType.isPrototypeOf(myTypeInstance) );
     *
     * @memberOf object#
     */
        // state, fullInit
    create: function(/** Object|...?= */state, /** boolean= */fullInit, /** ?= */arg2, /** ?= */arg3, /** ?= */arg4){
//        var instance = _(this, 'clone');
////        if(!this.hasOwnProperty('constructor')){
////            this.defineType();
////        }
//        return instance.constructor.apply(instance, arguments) || instance;
        
        // new operator works much faster than Object.create:
        return new this.constructor(state, fullInit, arg2, arg3, arg4);
    },
    
      /////////////////
     // Defining fields, property descriptors
    ///////////////////////////////////////////

    /**
     * Translate object to property descriptors.
     * For example, `{a: {b:1}, c:2}` will be translated to `{a: {value: {b:1}}, b: {value: 2}}`.  
     *  
     * Functions (except getters) and properties prefixed by "_" will be automatically marked as non-enumerable. 
     *  
     * Uppercase properties will be not writable. 
     *  
     * You can prefix your property names by `(get|set|init|const|final|hidden|writable)`:
     * <dl class="detailList params dl">
     * <dt>(get)     <dt><dd> define getter, if string passed, the getter function will be automatically generated.
     * <dt>(set)     <dt><dd> define setter, if string passed, the setter function will be automatically generated.
     * <dt>(init)    <dt><dd> on first property access, provided function will be called, and property will be redefined by returned value. 
     * <dt>(const)   <dt><dd> make property unwritable.
     * <dt>(final)   <dt><dd> make property unconfigurable (prevent it deleting and descriptor modifications).
     * <dt>(hidden)  <dt><dd> make property non-enumerable.
     * </dl>
     * @param properties
     * @param defaultDescriptor The default property descriptor.
     * @returns {{PropertyDescriptor}} Property descriptors.
     * @this {Object} Prototype only.
     * @static
     * @memberOf object
     */
    describe: function describe(/** Object */properties, /** PropertyDescriptor= */defaultDescriptor){
        
        var descriptors = {};
        
        /// Default properties descriptor:

        if(defaultDescriptor === undefined) defaultDescriptor = {
            configurable: true,
            enumerable: true,
            writable: true
        };
        
        /// Iterate properties:

        var hideMethods = !(defaultDescriptor && defaultDescriptor.enumerable);

        for(var name in properties){
            
            var value = properties[name];
            var descriptor = Object.create(defaultDescriptor);
            var accessorFn = null;
            
            /// process dots in name:
            
//            if(name.indexOf('.')){
//                var names = name.split('.');
//                var eachProperty = properties;
//                for(var i=0, sz=names.length; i < sz; i++){
//                    var eachName = names[i];
//                    eachProperty = eachName in eachProperty ? eachProperty[eachName].value : {};
//                }
//                eachProperty
//              
//            }

            /// apply property modifiers:
            
            if( name[0]=="(" ){
                //TODO: fix regexp to not mach the '(getset) property'
                var matches = name.match(/^\((((get|set|init|const|hidden|final|writable) *)+)\) +(.+)$/);
                if( matches ){
                    var modifiers = matches[1].split(" ").sort();
                    name = matches[4];

                    if( descriptors[name] ){ 
                        descriptor = descriptors[name];
                    
                    }else if( 
                        modifiers.indexOf('get')  >= 0 || 
                        modifiers.indexOf('set')  >= 0 ||
                        modifiers.indexOf('init') >= 0
                    ){
                        // default descriptor for field accessors:
//                        descriptor = {configurable: true, enumerable: true};
                        descriptor = _(descriptor, 'copy',[true]);
                        delete descriptor.writable;
                        delete descriptor.value;
                        
                        accessorFn = value;
                    }

                    for(var i in modifiers) switch(modifiers[i]){
                        //order by: abcdefghijklmnopqrstuvwxyz
                        case    'const': descriptor.writable     = false; break;
                        case    'final': descriptor.configurable = false; break; //descriptor.writable = false
                        case      'get': descriptor.get          = value; break;
                        case   'hidden': descriptor.enumerable   = false; break;
                        case      'set': descriptor.set          = value; break;
                        /* deprecated: */
                        case 'writable': descriptor.writable     = true;  break;
                    }
                                   
                    /// define getters/setters:
                    
                    if(accessorFn){
                        if(typeof accessorFn == 'string'){
                            var hiddenPropertyName = accessorFn;
                            if(typeof descriptor.get == 'string'){
                                accessorFn = descriptor.get = function getter(){
                                    return this[hiddenPropertyName];
                                }
                            }else if(typeof descriptor.set == 'string'){
                                accessorFn = descriptor.set = function setter(newValue){
                                    this[hiddenPropertyName] = newValue;
                                }
                            }
                        }
                        // A property cannot both have accessors and be writable or have a value:
                        //delete descriptor.value;
                        //delete descriptor.writable;
                        //Don't delete, let error be triggered
                    }
                    
                    /// `init` modifier:
                    
                    if( modifiers.indexOf('init') >= 0 ){
                        void function
                        /* let */(propertyName, accessorFn){                          
                            if(accessorFn.length) descriptor.set = propertyInitializer;
                            descriptor.get = propertyInitializer;
                            
                            function propertyInitializer(userSetValue){
                                var newValue = accessorFn.call(this, userSetValue);
//                                if(arguments.length){
//                                    newValue = userSetValue;
//                                }
                                
//                                var descriptor = Object.create($defaultDescriptor, {value: {value: newValue }});
                                var newDescriptor = Object.getOwnPropertyDescriptor(this, propertyName);
                                delete newDescriptor.get;
                                delete newDescriptor.set;
                                newDescriptor.value = newValue;
                                newDescriptor.writable = defaultDescriptor.writable;
                                
                                Object.defineProperty(this, propertyName, newDescriptor);
                                
                                return newValue;
                            }
                        }(name, accessorFn);
                    }
                    
                    ///

                    if(descriptor.get) value = undefined;// do not allow to hide getter (as default for function value)
                }
            }
            
            if(! accessorFn) descriptor.value = value;

            /// hide methods and private properties:
            
            if( hideMethods && typeof(value)=='function' 
            ||  name[0] == "_"
            ){
                descriptor.enumerable = false;
            }

            /// constants:
            
            if(name.toUpperCase() == name){
                descriptor.writable = false;
            }
            
            ///
            
            descriptors[name] = descriptor;
        }
        
        /// constructor:
        
        if( descriptors.hasOwnProperty('constructor') ){

            _(descriptors.constructor, 'defineType',[undefined, 'value', this]);
            
            descriptors.constructor.enumerable = false;
        }

        ///
        
        return descriptors;
    },


    describeFields: function(
    /**              Object */fields,
    /** PropertyDescriptor= */defaultDescriptor, 
    /**            boolean= */checkFinal
    ){
        var descriptors = {};
        _(fields, 'forEach', [function(value, name){
            if( name[0]=="(" ){
                //TODO: fix regexp to not mach the '(getset) property'
                var matches = name.match(/^\((((get|set|init|const|hidden|final|writable) *)+)\) +(.+)$/);
                if( matches ){
                    var modifiers = matches[1];
                    name = matches[4];
                }
            }
            descriptors[name] = _(this, 'describeField', [modifiers, name, value, defaultDescriptor, checkFinal, descriptors]);
        },this]);
        
        return descriptors;
    },

    /**
     * Create PropertyDescriptor.
     * @returns {PropertyDescriptor}
     * @see object#defineField
     * @this {Object} Prototype or instance.
     * @memberOf object#
     */
    describeField: function(
                            /** string? */modifiers, 
                             /** string */name, 
                                 /** *= */value, 
                /** PropertyDescriptor= */defaultDescriptor, 
                           /** boolean= */checkFinal,
        /** Array.<PropertyDescriptor>= */_descriptors
    ){
        if( checkFinal && ! _(this, 'canDefineProperty',[name]) ){
            throw new TypeError("Cannot redefine final (unconfigurable) property");
        }

        // Default properties descriptor:
        var descriptor = defaultDescriptor || {
            configurable: true,
            enumerable: true,
            writable: true
        };

        modifiers = modifiers.split(" ").sort();

        if( _descriptors[name] ){
            descriptor = _descriptors[name];

        }else if(
                modifiers.indexOf('get')  >= 0 ||
                modifiers.indexOf('set')  >= 0 ||
                modifiers.indexOf('init') >= 0
            ){
            delete descriptor.writable;
            delete descriptor.value;

            var accessorFn = value;
        }     
        
        
        
        return descriptor;
    },

    /**
     * @this {Object} Instance or prototype.
     * @memberOf object#
     * @returns Object
     */
    getPropertyDescriptor: function(/** string */name){
        var owner = _(this,'getPropertyOwner',[name]);
        return Object.getOwnPropertyDescriptor(owner, name);
    },
    
    /**
     * @returns {PropertyDescriptor}
     * @see object#defineField
     * @this {Object} Prototype or instance.
     * @memberOf object#
     */
    defineInitProperty: function(/** string */propertyName, /** function:* */initFn, /** PropertyDescriptor= */descriptor){
        
    },
    
    /**
     * @returns {Function}
     * @this {Object} Prototype or instance.
     * @memberOf object#
     */
    defineType: function(
                     /** string= */typeName, 
        /** string='constructor' */_constructorProperty, 
                 /** Object=this */_prototype
    ){
        if( _constructorProperty === undefined ){
            _constructorProperty = 'constructor';
        }
        if( _prototype === undefined ){
            _prototype = this;
        }
        //</arguments>
        
        var Type = this[_constructorProperty];
        
        if(typeof Type == 'string' || !this.hasOwnProperty(_constructorProperty) ){
            if(!typeName ){
                typeName = Type;
            }
            // isn't slow, see http://jsperf.com/eval-vs-new-function-vs-function
            Type = Function(
                "return function "+ typeName +"(){return this.applySuper(arguments)}"
            )();
            Type.typeName = typeName;
            this[_constructorProperty] = Type;

        }else if(!Type.typeName){
            Type.typeName = typeName || Type.name || "Extended" + _prototype.constructor.typeName;//+n
        }

        Type.prototype = _prototype;
        
        return Type;
    },
    
    /**
     * @this {Object} Prototype or instance.
     * @memberOf object#
     */
    defineField: function(/** string='' */modifiers, /** string */name, /** *= */value, /** PropertyDescriptor= */defaultDescriptor){
        var descriptor = _(this, 'describeField', arguments);
        Object.defineProperty(this, name, descriptor);
        return this;
    },

    /**
     * @see object#defineField
     * @this {Object} Prototype or instance.
     * @memberOf object#
     */
    defineFields: function(/** Object */fields, /** PropertyDescriptor= */defaultDescriptor){
        Object.defineProperties(this, _(this,'describe',[fields, defaultDescriptor]) );
        return this;
    },
    
    /**
     * Return true if property (or prototype property) configurable.
     * @returns {boolean}
     * @this {Object} Prototype or instance.
     * @memberOf object#
     */
    canDefineProperty: function(/** string */name){
        if(name in this){
            var descriptor = _(this, 'getPropertyDescriptor', [name]);
            return descriptor.configurable;
        }else{
            return Object.isExtensible(this);
        }
    },

      /////////////////
     // Super
    ///////////////////////////////////////////
    
    /**
     * Apply method of super object (prototype) to this object.
     * @returns {*}
     * @see object#__super__
     * @see object#callSuper
     * @this {Object} Instance only.
     * @protected
     * @memberOf object#
     */
    applySuper: function(/** string='constructor'|Array */ methodName, /** Array= */args){
        if( typeof(methodName) != 'string'){
            args = methodName;
            methodName = 'constructor';
        }//</arguments>

        '__super__' in this || this.getSuper(true);

        // save super
        var savedSuper = this.__super__;
        // set super to next by prototype chain, in case if method also call applySuper
        this.__super__ = Object.getPrototypeOf(savedSuper);
        try{
            // apply method
            var callbackReturns = savedSuper[methodName].apply(this, args);
        }finally{
            // restore super
            this.__super__ = savedSuper;
        }

        return callbackReturns;
    },

    /** @see object#applySuper
     *  @see object#__super__
     *  @this {Object} Instance only.
     *  @protected
     *  @memberOf object# */
    callSuper: function(/** string */methodName, /** ?= */ arg1, /** ...?= */argN){
        var args = Array.prototype.slice.call(arguments, 1);
        return this.applySuper(methodName, args);
    },

    /**
     * Returns parent prototype for this object.
     * @this {Object} Instance only.
     * @returns {Object}
     * @memberOf object#
     */
    getSuper: function(/** boolean=false */define){
        var __super__ = Object.getPrototypeOf(this);
        if( __super__ !== object && this.isInstance() ){
            __super__ = Object.getPrototypeOf(__super__);
        }
        if(define){
            Object.defineProperty(
                this, '__super__', {value: __super__, writable:true, configurable:true}
                /**
                 * Link to the prototype.
                 * Dynamically changed to next by prototype chain, while `{@link #applySuper}` method executing.
                 * System property. **Use it only for debug purposes**.
                 * @name  __super__
                 * @type  {?Object}
                 * @see pObject#applySuper
                 * @private
                 * @memberOf pObject#
                 */
            );
        }
        return  __super__;    
    },
//    /**
//     * Parent prototype for this object.
//     * Dynamically changed to next by prototype chain, while `{@link #applySuper}` method executing.
//     * @name  _super
//     * @type  {?Object}
//     * @this {Object} Instance only.
//     * @see object#applySuper
//     * @memberOf object#
//     */
//    '(init hidden) _super': function(){
//        var _super = Object.getPrototypeOf(this);
//        if( _super !== object && this.isInstance() ){
//            _super = Object.getPrototypeOf(_super);
//        }
//        return _super; 
//    },
//    __super__: undefined,
//    '(get hidden) _super': function(){
//        if( this.__super__ ){
//            return this.__super__;
//        }
//        
//        var _super = Object.getPrototypeOf(this);
//        if( _super !== object && this.isInstance() ){
//            _super = Object.getPrototypeOf(_super);
//        }
//        return _super;        
//    },
//    '(set) _super': function(value){
//        if( this.__super__ === value ){
//            this.__super__ = undefined;
//        }else{
//            this.setValue('__super__', value);
//        }
//    },
//    this._super
    
    /**
     * Use this method to wrap callback, that can call `{@link #applySuper}` method.
     * @see object#applySuper
     * @this {Object} Instance only.
     * @returns {Function}
     * @memberOf object#
     */
    createBoundMethod: function(/** function|string */functionOrMethodName, /** Array=|boolean */boundArgs, /** boolean=false */superSafe){
        if(typeof functionOrMethodName === 'string'){
            var method = this[functionOrMethodName];
        }else{
            method = functionOrMethodName;
        }
        if(typeof boundArgs === 'boolean'){
            superSafe = boundArgs;
            boundArgs = undefined;
        }
        //</arguments>
        
        if(superSafe){

            var self = this;
            var superOnCreateCallback = this.__super__;
    
            return function superSafeBoundMethodFn(){
                var args = arguments;
                if( boundArgs !== undefined ){
                    args = Array.prototype.concat.call(boundArgs, args);
                }
                
                var superOnCall = self.__super__;
                if( superOnCall === superOnCreateCallback ){
                    return method.apply(self, args);
    
                }else{
                    self.__super__ = superOnCreateCallback;
                    try{
                        var callbackReturns = method.apply(self, args);
                    }finally{
                        self.__super__ = superOnCall;
                    }
                    return callbackReturns;
                }
            }
            
        }else{
            
            return method.bind(this, boundArgs);
            
        }
    },

      /////////////////
     // 
    ///////////////////////////////////////////

    /**
     * Return new object, that have a copies of all own properties of this object.  
     * Arguments can be passed in any order (recognized by type).
     * @example
     * var $collection = object.clone(),
     *     $users = $collection.clone();
     *
     * // $users full prototype chain:
     * $users -> $collection -> object -> Object.prototype -> null
     *
     * // see prototype chains produced by copy:
     *
     * $users.copy():
     *     ~$users -> object
     *
     * $users.copy(rootPrototype:Array):
     *     ~$users -> Array.prototype
     *
     * $users.copy(rootPrototype:$parent, parentsLevel:Infinity):
     *     ~$users -> ~$collection -> ~object -> $parent
     *
     * $users.copy(rootPrototype:$parent, parentsLevel:Infinity, mixParents:true):
     *     ~($users + $collection + object) -> $parent
     *
     * // where ~$users:
     * New plain object, that have a copy of every own $user property.
     *
     * @this {Object} Instance or prototype.
     * 
     * @param deepMethod
     *        How to process inner objects. Can be:        
     *        "deepCopy"  - see `{@link #deepCopy}`   
     *        "deepClone" - see `{@link #deepClone}`  
     *        "" - do nothing (default).
     *
     * @param rootPrototype
     *        The root prototype for created object prototype chain. If it is Constructor, Constructor.prototype will be used instead.  
     *        By default - object;
     *
     * @param parentsLevel
     *        How many parents should be included. By default - zero.  
     *        Set this to Infinity if you want to copy all object parents properties up to object.
     *        Set negative value to pop some last parents.
     *
     * @param mixParents
     *        Should be false if objects have methods, that call `{@link #applySuper}`.
     *        If true, all own properties of all objects will be directly attached to the one returned object.  
     *        False by default.
     *
     * @returns {Object}
     * @memberOf object#
     */
    copy: function(
    /**                   number=0       */parentsLevel,
    /**                  boolean=false   */mixParents,

    /**                    Array=        */propertyNames,

    /**             null|boolean=true    */copyDescriptors,
    /**   (Object!|Constructor!)=object  */rootPrototype
    ){
        propertyNames = rootPrototype = parentsLevel = mixParents = undefined;
        copyDescriptors = true;
        
        for(var i=0, value=arguments[i], length=arguments.length; i<length; value=arguments[++i]) switch(typeof value){
            //case 'string':   deepMethod    = value; break;
            case 'function': rootPrototype = value.prototype; break;
            case 'object':   
                if(value === null)
                             copyDescriptors = false;
                else if ( Array.isArray(value) )
                             propertyNames= value;
                else
                             rootPrototype = value; break; 
            case 'number':   parentsLevel  = value; break;
            case 'boolean':  mixParents    = value; break;
        }

//        if( deepMethod != 'deepCopy' || deepMethod != 'deepClone'){
//            deepMethod = undefined;
//        }

        if( rootPrototype === undefined){
            rootPrototype = object;
        }
        //</arguments>
        
        if(mixParents && parentsLevel === undefined) parentsLevel = Infinity;

        var sourceObj = this;
        if( typeof(sourceObj)=='function' && Object.getOwnPropertyNames(sourceObj.prototype) ){
            sourceObj = sourceObj.prototype;
        }
        var newObj    = Object.create(rootPrototype);
        var updateObj = newObj;

        if( propertyNames ){
            
            if( copyDescriptors ){
                _(sourceObj, 'paste',[updateObj, propertyNames]);
            }else{
                propertyNames.forEach(function(propertyName){     
                    if(propertyName in sourceObj) updateObj[propertyName] = sourceObj[propertyName];
                });
            }

        }else{

            if( parentsLevel < 0){
                var popParents = - parentsLevel;
                parentsLevel = Infinity;
            }
            
            var sourceObjects = [];
            do{
                sourceObjects.push(sourceObj);
                sourceObj = Object.getPrototypeOf(sourceObj);
            }while(parentsLevel-- && sourceObj != Object.prototype);
            
            if( popParents ){
                sourceObjects = sourceObjects.slice(0, sourceObjects.length - popParents);    
            }
    
            sourceObjects = sourceObjects.reverse();
    
            for(var i=0, length=sourceObjects.length; i<length; i++){
                sourceObj = sourceObjects[i];
                var ownPropertyNames = Object.getOwnPropertyNames(sourceObj);
                if (!mixParents && i > 0 && ownPropertyNames.length){
                    updateObj = _(updateObj, 'clone');
                }
    
                // copy all own properties:
                for(var j=0, jLength=ownPropertyNames.length; j<jLength; j++){
                    var name = ownPropertyNames[j];
                    
                    if(copyDescriptors){
        
                        var descriptor = Object.getOwnPropertyDescriptor(sourceObj, name);
    //                    var value = descriptor.value;         
                        Object.defineProperty(updateObj, name, descriptor);
                        
                    }else{
    //                    value = sourceObj[name];
                        updateObj[name] = sourceObj[name];
                    }
    
    //                if( deepMethod && typeof value == 'object' && value !== null){
    //                    deepMethod = this[deepMethod] || object[deepMethod];
    //                    value = deepMethod.call(value);
    //                    var valueUpdated = true;
    //                }
    //                
    //                if(!copyDescriptors || valueUpdated){
    //                    updateObj[name] = value;
    //                }
                }
            }
        }

        return updateObj;
    },

    /**
     * Create a copy of this and all inner objects.
     * @see object#copy
     * @see object#deepClone
     * @this {Object} Instance or prototype.
     * @returns {object}
     * @memberOf object#
     */
    deepCopy: function deepCopy(
    /**                   number=0       */parentsLevel,
    /**                  boolean=false   */mixParents,

    /**                    Array=        */propertyNames,

    /**             null|boolean=true    */copyDescriptors,
    /**   (Object!|Constructor!)=object  */rootPrototype
    ){
//        var args = [this.copy || object.copy].concat(arguments);
//        Array.prototype.unshift.call(arguments, this.copy || object.copy);
        return _(this, 'deepApply', ['copy', arguments]);
    },

    /**
     * Create a clone of this, and also create a clones of all inner objects.  
     * So, if you modify any inner object of deep clone, it will not affect parent (this) object.  
     * But, if you modify parent (this), it can affect deep clone(s).
     * @see object#clone
     * @see object#deepCopy
     * @see object.describe
     * @this {Object} Instance or prototype.
     * @returns {object}
     * @memberOf object#
     */
    deepClone: function deepClone(/** Object= */properties, /** PropertyDescriptor= */defaultDescriptor){
//        Array.prototype.unshift.call(arguments, this.clone || object.clone);
        return _(this, 'deepApply', ['clone', arguments]);
    },

    /**
     * Apply method or function (that should return object) to this object itself and all inner objects recursivelly.
     * @see object#copy
     * @see object#deepClone
     * @this {Object} Instance or prototype.
     * @returns {object}
     * @memberOf object#
     */
    deepApply: function deepApply(/** string|function:Object */method, /** Array */args){
        //args = Array.prototype.slice.call(arguments, 1);
        if(typeof method === 'string'){
            var fn = (this[method] || object[method]);
        }else/* if(typeof method === 'function')*/{
            fn = method;
        }
        var obj = fn.apply(this, args);

        var ownPropertyNames = Object.getOwnPropertyNames(this);
        for(var i=0, length=ownPropertyNames.length; i<length; i++){
            var name = ownPropertyNames[i];
            var descriptor = Object.getOwnPropertyDescriptor(this, name);
            var value = descriptor.value;
            if(typeof value == 'object' && value !== null){
                descriptor.value = deepApply.apply(value, arguments);
                Object.defineProperty(obj, name, descriptor);
            }
        }

        return obj;
    },

    /**
     * Paste properties to other object.
     * @see object#concat
     * @this {Object} Prototype or instance.
     * @memberOf object#
     */
    paste: function(/** Object */pasteToObj, /** (Array|boolean)=false */allPropertyNames){
//        return object.apply(pasteToObj, 'concat', [this, allPropertyNames]);
        //return (this.concat || object.concat).call(pasteToObj, this, allPropertyNames);
        if(!allPropertyNames ){
            allPropertyNames = this.getOwnPropertyNames();

        }else if( allPropertyNames === true){
            allPropertyNames = this.getOwnPropertyNames();
            var proto = this;
//            while( (proto = Object.getPrototypeOf(proto)) && proto !== object ){
//                //allPropertyNames = allPropertyNames.concat( proto.getOwnPropertyNames() );
//                pasteProperties(proto, pasteToObj, proto.getOwnPropertyNames() );
//            }
            _(this, 'getPrototypes').forEach(function(proto){
                pasteProperties(proto, pasteToObj, proto.getOwnPropertyNames() );
            });
        }

        pasteProperties(this, pasteToObj, allPropertyNames);
        
        return pasteToObj;
            
            function pasteProperties(fromObj, toObj, propertyNames){
                for(var i=0, length=propertyNames.length; i<length; i++){
                    var name = propertyNames[i];
                    
                    var descriptor = _(fromObj, 'getPropertyDescriptor',[name]);
                    Object.defineProperty(toObj, name, descriptor);
                }
            }
    },
    
    // merge

//    /**
//     * Copy properties from given object. 
//     * If allPropertyNames does not specified, only own properties will be copied.
//     * @this {Object} Instance or prototype.
//     * @param obj
//     * @param allPropertyNames Array of property names, or `true`. 
//     *        If true, all (own and parents) properties will be copied. 
//     * @returns {object} this
//     * @see object#paste
//     * @memberOf object#
//     */
//    concat: function(/** Object */obj, /** (Array|boolean)= */allPropertyNames){
//        if(!allPropertyNames ){
//            allPropertyNames = obj.getOwnPropertyNames();
//            
//        }else if(! Array.isArray(allPropertyNames) && allPropertyNames == true){
//            allPropertyNames = obj.getOwnPropertyNames();
//            var proto = obj;
//            while( (proto = Object.getPrototypeOf(proto)) && proto !== object ){
//                allPropertyNames = allPropertyNames.concat( proto.getOwnPropertyNames() );
//            }
//        }
//
//        proto = obj;
//        do 
//            for(var i=0, length=allPropertyNames.length; i<length; i++){
//                var name = allPropertyNames[i];
//                var descriptor = Object.getOwnPropertyDescriptor(proto, name);
//                if( descriptor ){
//                    Object.defineProperty(this, name, descriptor);
//                    delete allPropertyNames[i];
//                }
//            }
//        while(allPropertyNames.length && (proto = Object.getPrototypeOf(proto)) !== Object.prototype);
//
//        return this;
//    },

//    /**
//     * Apply method from one object to another object.
//     * @example
//     *     var  args = object.apply(arguments, 'slice',[1], Array);
//     *     var  args = object.apply.call(Array, arguments, 'slice',[1]);
//     * @this {Object} Prototype only.
//     * @returns {*}
//     * @static
//     * @memberOf object
//     */
//    apply: function(/** Object */withObj, /** string */methodName, /** Array= */args, /** Object= */asObj){
//        if(!asObj){
//            asObj = typeof(withObj[methodName])=='function' 
//                 && withObj[methodName].length == this[methodName].length 
//                 && withObj 
//                 || this;
//
//        }else if(typeof asObj == 'function' && asObj.prototype){
//            asObj = asObj.prototype;
//        }
//
//        return asObj[methodName].apply(withObj, args);
//    },

//    /**
//     * Use this to check if method of one object is the same as in the another object.
//     * @example
//     * var myObj1 = object.clone({join: function(sep){} });
//     * var myObj2 = object.clone({join: function(){}    });
//     * assert( myObj1.can('split').like( Array.prototype ) === true  );
//     * assert( myObj2.can('split').like( Array.prototype ) === false );
//     * assert( myObj1.can('split').as(   Array.prototype ) === false );
//     * assert( object.can.call(new Array, 'split').as(new Array) === true  );
//     *
//     * @this {Object} Instance or prototype.
//     * @returns {{like: function(Object):boolean, as: function(Object):boolean}}
//     * @memberOf object#
//     */
//    can: function(/** string */method, /** number=false */not){
//        var obj1 = this;
//        return {
//            /** @ignore *///jsdoc3
//            valueOf: function(){
//                // a ^ b == a ? !b : b
//                return not ^ typeof( obj1[method] )=='function';
//            },
//
//            like: function(obj2){
//                var obj2Method = obj2[method];
//                return this.valueOf()
//                    && not ^ (
//                    typeof(obj2Method)=='function' &&
//                        obj2Method.length == obj1[method].length
//                    );
//            },
//
//            as: function(obj2){
//                return this.valueOf()
//                    && not ^ obj1[method] === obj2[method];
//            }
//        }
//    },
//
//    /**
//     * @see object#can
//     * @this {Object} Instance or prototype.
//     * @memberof object# */
//    cant: function(/** string */method){
//        return this.can(method, 1);
//    },

      /////////////////
     // Iteration methods
    ///////////////////////////////////////////

    /**
     * Executes a provided function once per every enumerable property. 
     * Is identical to `for in`.
     * @this {Object} Instance or prototype.
     * @memberof object# */
    forEach: function(
        /** function(*=value,string=key,Object=this) */
                            callback, 
        /**   Object=this */scope, 
        /**  boolean=true */enumerableOnly, 
        /** boolean=false */ownOnly
    ){
        if(typeof scope !== 'object' && typeof scope !== 'function'){
            ownOnly = enumerableOnly;
            enumerableOnly = scope;
            scope = this;

        }else if(scope === undefined){
            scope = this;
        }
        if( enumerableOnly === undefined){
            enumerableOnly = true;
        }
        // </arguments>

        if(!enumerableOnly){
            var keys = _(this, 'getKeys',[enumerableOnly, ownOnly]);
            for(var i= 0, length= keys.length; i<length; i++){ name = keys[i];
                callback.call(scope, this[name], name, this);
            }
        }else if(ownOnly){
            // see http://jsperf.com/object-keys-iteration/3
            //     http://jsperf.com/object-keys-vs-for-in-for-values/2

//            var properties = Object.keys(this);
//            for(var i= 0, length = properties.length; i < length; i++){
//                name = properties[i];
//                callback.call(scope, this[name], name, this);
//            }
            for(var name in this) if(this.hasOwnProperty(name)){
                callback.call(scope, this[name], name, this);
            }
        }else{

            for(var name in this){
                callback.call(scope, this[name], name, this);
            }
        }
    },

    /**
     * Tests whether all enumerable properties in the object pass the test implemented by the provided function.
     * @this {Object} Instance or prototype.
     * @returns {boolean}
     * @memberof object# */
    every: function(
        /** function(*=value,string=key,Object=this) */
                            callback, 
        /**   Object=this */scope, 
        /**  boolean=true */enumerableOnly, 
        /** boolean=false */ownOnly
    ){
        if(!(scope instanceof Object)){// http://jsperf.com/instanceof-object-vs-double-typeof
            ownOnly = enumerableOnly;
            enumerableOnly = scope;
            scope = this;

        }else if(scope === undefined){
            scope = this;
        }
        if( enumerableOnly === undefined){
            enumerableOnly = true;    
        }
        // </arguments>
        
        if(!enumerableOnly){
            
            //var keys = object.getKeys.call(this, enumerableOnly, ownOnly);
            var keys = _(this, 'getKeys',[enumerableOnly, ownOnly]);
            for(var i= 0, length= keys.length; i<length; i++){ name = keys[i];
                if(! callback.call(scope, this[name], name, this) ) return false;
            }
        }else if(ownOnly){
            
            for(var name in this) if(this.hasOwnProperty(name)){
                if(! callback.call(scope, this[name], name, this) ) return false;
            }
        }else{
            
            for(var name in this){
                if(! callback.call(scope, this[name], name, this) ) return false;
            }
        }
        
        return true;
    },

    /**
     * Tests whether some enumerable properties in the object pass the test implemented by the provided function.
     * @this {Object} Instance or prototype.
     * @returns {boolean}
     * @memberof object# */
    some: function(
        /** function(*=value,string=key,Object=this) */
                            callback, 
        /**   Object=this */scope, 
        /**  boolean=true */enumerableOnly, 
        /** boolean=false */ownOnly
    ){
        if(!(scope instanceof Object)){// http://jsperf.com/instanceof-object-vs-double-typeof
            ownOnly = enumerableOnly;
            enumerableOnly = scope;
            scope = this;

        }else if(scope === undefined){
            scope = this;
        }
        if( enumerableOnly === undefined){
            enumerableOnly = true;
        }
        // </arguments>

        if(!enumerableOnly){

            var keys = _(this, 'getKeys',[enumerableOnly, ownOnly]);
            for(var i= 0, length= keys.length; i<length; i++){ name = keys[i];
                if( callback.call(scope, this[name], name, this) ) return true;
            }
        }else if(ownOnly){

            for(var name in this) if(this.hasOwnProperty(name)){
                if( callback.call(scope, this[name], name, this) ) return true;
            }
        }else{

            for(var name in this){
                if( callback.call(scope, this[name], name, this) ) return true;
            }
        }
        
        return false;
    },

    /**
     * Creates a new object with the results of calling a provided function on every enumerable property.
     * @this {Object} Instance or prototype.
     * @returns {Object}
     * @memberof object# */
    map: function(
        /** function(*=value,string=key,Object=this):? */
                              callback, 
        /**  !Object=result  */scope,
        /**  boolean=true    */enumerableOnly,
        /**  boolean=false   */ownOnly, 
        /**  !Object=object */prototype
    ){
        if(!prototype) prototype = object;
        var result = _(prototype, 'clone');

        _(this, 'forEach', [function(value, name, self){
            
            var returned = callback.call(this, value, name, self);
            if( typeof returned === 'undefined' ){
                // undefined values will be not enumerable:
                Object.defineProperty(result, name, {value: undefined});
            }else result[name] = returned;
            
        }, scope || result, enumerableOnly, ownOnly]);
 
        return result;
    },

    /**
     * Creates a new object with all enumerable properties that pass the test implemented by the provided function.
     * @this {Object} Instance or prototype.
     * @returns {Object}
     * @memberof object# */
    filter: function(
        /** function(*=value,string=key,Object=this):? */
                              callback, 
        /**  Object=result  */scope,
        /** boolean=true    */enumerableOnly,
        /** boolean=false   */ownOnly, 
        /**  Object=object */prototype
    ){
        if(!prototype) prototype = object;
        var result = _(prototype, 'clone');

        _(this, 'forEach', [function(value, name, self){
            if(! callback.call(this, value, name, self) ){
                Object.defineProperty(result, name, {value: undefined});
            }
        }, scope || result, enumerableOnly, ownOnly]);
        
        return result;
    },

      /////////////////
     // Object state & property values
    ///////////////////////////////////////////


    /**
     * Returns all changed properties, since cloning of object.
     * Separate object from its prototype and return it.
     * @this {Object} Instance.
     * @param listHidden Add non-enumerable properties.
     * @returns {object}
     * @memberOf object#
     */
    getState: function(/** boolean=false */listHidden, newPrototype){
        var state = Clone(newPrototype || null);
        var ownProperties = listHidden ? Object.getOwnPropertyNames(this) : Object.keys(this);

        for(var i= 0, length=ownProperties.length; i<length; i++){
            var name = ownProperties[i];
            state[name] = this[name];
        }

        if( /*! this.isInstance() &&*/ listHidden ){
            //remove methods from state:
            state = _(state,'filter',[function(value){
                return typeof value !== 'function';
            }]);
        }

        return state;
    },
    
    toArray: object.getValuesx, 

    /**
     * 
     * @see #setValue
     * @this {Object} Instance.
     * @memberOf object#
     */
    setState: function(/** Object */keyValue, /** boolean=false */ignoreErrorsAndDescriptors, /** boolean=false */fullInit){
        if(ignoreErrorsAndDescriptors){
            for( var key in keyValue ){
                this[key] = keyValue[key];
            }
            if( fullInit ){
                for(var key in this){
                    if( ! this.hasOwnProperty(key) ){
                        this[key] = this[key];
                    }
                }                
            }
        }else{
            var setValue = (this.setValue || _.prototype.setValue);
            for(var key in keyValue ){
                setValue.call(this, key, keyValue[key]);
            }
            if( fullInit ){
                for(var key in this){
                    if( ! this.hasOwnProperty(key) ){
                        setValue.call(this, key);
                    }
                }
            }
        }
        
        if( fullInit ){
            // if all properties initiated, we can prevent adding new properties.
            Object.seal(this);
        }
    },

    /**
     * Set property value. Property should be defined in object (or it's prototypes).
     * If property is not own for object, the property descriptor will be inherited from prototype property.
     * @param {?=} value If not specified (only not specified, undefined value will be set to undefined), prototype value will be used.
     * @this {Object} Instance.
     * @memberOf object#
     */
    setValue: function(/** string */propertyName, /** ?= */value){
        if( propertyName in this){
            if(arguments.length === 1){// cannot be replaced by typeof value === 'undefined' check!
                // get value from prototype
                value = this[value];
                var getterMaybeCalled = true;
            }
            
            if( this.hasOwnProperty(propertyName) ){
                this[propertyName] = value;
            }else{
                // slow method!
                var descriptor = _(this, 'getPropertyDescriptor',[propertyName]);

                if( descriptor.set ){
                    var getterCalled   = descriptor.get && getterMaybeCalled;
                    var hasInitializer = descriptor.set === descriptor.get;
                    if( !(getterCalled && hasInitializer) ){
                        // call setter:
                        this[propertyName] = value;
                    }
                }else{
                    if( descriptor.writable ){
                        descriptor.value = value;
                        Object.defineProperty(this, propertyName, descriptor);
                    }else{
                        throw new TypeError(
                            "Cannot assign to read only property '"+ propertyName +"' of '"
                                +(this.constructor.typeName || this.constructor.name)+"'"
                        );
                    }
                }
            }
        }else{
            throw new TypeError(
                "Property '"+ propertyName +"' is not a member of '"
                    +(this.constructor.typeName || this.constructor.name)+"'"
            );
        }
    },
    
    /**
     * @this {Object} Instance or prototype.
     * @returns {Array} All own enumerable property values.
     * @memberof object# */
    getValues: function(/** boolean=true */enumerableOnly,/** boolean=true */ownOnly){
        var keys = _(this, 'getKeys', arguments);
        //console.log("getValues:", keys, enumerableOnly, ownOnly);
        return keys.map(function(key){
            return this[key];
        }, this);
    },

//    /**
//     * Set values for own enumerable properties. Order of values should be the same as `{@link object#getValues}()` produce.
//     * @this {Object} Instance or prototype.
//     * @memberof object# */
//    setValues: function(/** Array */values, /** boolean=true */enumerableOnly, /** boolean=true */ownOnly){
//        var keys = _(this, 'getKeys',[enumerableOnly, ownOnly]);
//        //console.log("setValues:", keys, enumerableOnly, ownOnly);
//        keys.forEach(function(key, i){
//            //console.log(i,key);
//            if(i in values) this[key] = values[i];
//        }, this);
//        return this;
//    },

    /**
     * If called without args - `getKeys()` will behaves like [Object.keys⠙][1].  
     * If called with false - `getKeys(false)` will behave like [Object.getOwnPropertyNames⠙][2]
     * [1]: http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
     * [2]: http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
     * @see object#getOwnPropertyNames
     * @this {Object} Instance or prototype.
     * @returns {Array} All own enumerable property names.
     * @memberof object# */
    getKeys: function(/** boolean=true */enumerableOnly, /** boolean=true */ownOnly){
        enumerableOnly = enumerableOnly === undefined || Boolean(enumerableOnly);
               ownOnly =        ownOnly === undefined || Boolean(ownOnly);
        
        var nativeMethod =  enumerableOnly && ownOnly && 'keys'
                        || !enumerableOnly && ownOnly && 'getOwnPropertyNames';        
        
        if( nativeMethod ){

            return Object[nativeMethod](this);
            
        }else{
            var keys = [];
            
            if(!ownOnly && enumerableOnly){

                _(this, 'forEach', [function(value, key){
                    keys.push(key);
                },null, enumerableOnly, ownOnly]);

            }else{// get all properties:
                
                keys = Object.getOwnPropertyNames(this);
                _(this, 'getPrototypes').forEach(function(proto){
                    keys = keys.concat(Object.getOwnPropertyNames(proto));
                });
            }

            return keys;
        }
    },


      /////////////////
     // Prototypes
    ///////////////////////////////////////////
    
    /**
     * Returns array of object prototype chain.
     * @this {Object} Instance or prototype.
     * @returns {Array}
     * @memberof object#
     */
    getPrototypes: function(/** Object=object */last, /** boolean=false */notRevert){
        var prototypes = [];
        var proto = this;
        var pushMethod = notRevert ? 'push' : 'unshift';
        if(typeof last == 'undefined') last = object;

        while((proto = Object.getPrototypeOf(proto)) && proto != last){
            prototypes[pushMethod](proto);
            console.log(proto, proto === object);
        }

        return prototypes;
    },

    /**
     * Returns prototype, owner of given property name.
     * @this {Object} Instance or prototype.
     * @memberOf object#
     * @returns {Object?} Prototype
     */
    getPropertyOwner: function(/** string */name){
        if(name in this){
            var owner = this;
            while(owner){
                if( owner.hasOwnProperty(name) ){
                    return owner;
                }else{
                    owner = Object.getPrototypeOf(owner);
                }
            }
        }
        return undefined;
    },

    /**
     * @this {Object} Instance or prototype.
     * @returns {boolean}
     * @memberOf object#
     */
    isInstance: function(){
        return ! this.hasOwnProperty('constructor');
    },

    /**
     * @this {Object} Instance or prototype.
     * @returns {boolean}
     * @memberOf object#
     */
    isPrototype: function(){
        return this.hasOwnProperty('constructor');
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
//                if(name[0]!=="_"){
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

      /////////////////
     // Some sugar:
    ///////////////////////////////////////////

    /**
     * Returns the name and current state of this object.
     * @see object#getState
     * @memberof object# */
    toString: function(){
        var Type = this.constructor;
        return "["+ (Type.typeName || Type.name) +" "+ JSON.stringify( this.getState() )+"]";
    },
    
    ///

    /** Wrapper for [Object.getPrototypeOf⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
     * @memberof object# */
    getProto: function(){
        return Object.getPrototypeOf(this);
    },
    /** Wrapper for [Object.getOwnPropertyNames⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)
     * @memberof object# */
    getOwnPropertyNames: function(){
        return Object.getOwnPropertyNames(this);
    },

    /** Wrapper for [Object.getOwnPropertyDescriptor⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
     * @memberof object# */
    getOwnPropertyDescriptor: function(/** string */ name){
        return Object.getOwnPropertyDescriptor(this, name);
    },

    /** Define properties.
     *  @see <a href="http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperties">Object.defineProperties⠙</a>
     *  @see object.describe
     *  @this {Object} Instance or prototype.
     *  @memberOf object# */
    defineProperties: function(/** Object.<string,PropertyDescriptor> */propertyDescriptors){
        Object.defineProperties(this, propertyDescriptors);
        return this;
    },

    /** Wrapper for [Object.defineProperty⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty)
     *  @this {Object} Instance or prototype.
     *  @memberOf object# */
    defineProperty: function(/** string */name, /** PropertyDescriptor */propertyDescriptor){
        return Object.defineProperty(this, name, propertyDescriptor);
        return this;
    },
    

    /** Wrapper for [Object.preventExtensions⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/preventExtensions)
     * @memberof object# */
    preventExtensions: function(){
        '__super__' in this || this.getSuper(true);
        return Object.preventExtensions(this);
        return this;
    },
    /** Wrapper for [Object.isExtensible⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isExtensible)
     * @memberof object# */
    isExtensible: function(){
        return Object.isExtensible(this);
    },
    /** Wrapper for [Object.seal⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/seal)
     * @memberof object# */
    seal: function(){
        '__super__' in this || this.getSuper(true);
        return Object.seal(this);
        return this;
    },
    /** Wrapper for [Object.isSealed⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isSealed)
     * @memberof object# */
    isSealed: function(){
        return Object.isSealed(this);
    },
    /** Wrapper for [Object.freeze⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/freeze)
     * @memberof object# */
    freeze: function(){
        Object.freeze(this);
        return this;
    },
    /** Wrapper for [Object.isFrozen⠙](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isFrozen)
     * @memberof object# */
    isFrozen: function(){
        return Object.isFrozen(this);
    }
};
    
//object = _(Clone.prototype, 'defineFields', [object]);
Object.defineProperties(Clone.prototype, object);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = Clone;

//_( _, 'defineFields', [{
//    
//    '(init) prototype': function(){
//        return this.inject({});
//    },
//    
//    '(get) inject': function(){
//        this(this, 'defineField', ['', 'inject', function(prototype){
//            return this.prototype.paste(prototype);    
//        }]);
//        return function(prototype){
//            return this(prototype, 'defineFields', [cloneFields]);
//        }
//    }
//}]);


return;
    
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
         * @name PropertyDescriptor
         * @typedef {({value:*}|{get:{function():*}}|{set:{function(*):void}}|{writable:boolean}|{configurable:boolean}|{enumerable:boolean})} */
        PropertyDescriptor;
        //{Object.< 'writable'|'configurable'|'enumerable', boolean= > | Object.<'get'|'set',function> | Object.<'value',?> }
        //{Object.< 'writable'|'configurable'|'enumerable', boolean= > | Object.<'get'|'set'|'configurable'|'enumerable', function|boolean= >}

        /**
         * JavaScript class. Function, that can be called by "new" operator and/or have modified prototype property.
         * For example: `Object`, `Array`, `RegExp`.
         * @name Constructor
         * @typedef {Function} */
  
         /**
         * Simple key-value object, which proto is Object.prototype and all it properties is enumerable.
         * @name Hash
         * @typedef {Object} */

/**#nocode+*/
})(this);
/**#nocode-*/

/**
 * Simple key-value object, which proto is Object.prototype and all it properties is enumerable.
 * @name Hashi
 * @typedef {function(string)} */
Hashi;

function a(/** Hashi */h){
  
}
a(new Object);
a({set: 11});
a(Object);
a( Object() );
a( 23 );
a( function(){} );


/*

core:
  
  clone
  create // clone and apply constructor (works faster than clone on V8)
  extend // clone and createType (by default)
  
  createType // just return new Function (not modify this)
  set, get // get('property') will return undefined on not-enumerable properties (by default). get(['p1','p2']), set(['p1','p2'], [1,2])
  define
  describe
  
  super
  applySuper
  callSuper
  
  core utils:
  
  createBoundMethod
  getPropertyOwner
  
  
objects copy & merge:
  
  copy
  paste
  deepCopy
  deepClone
  deepApply


*****

  modifiers:
  
  describe
  
  
  modifiers: {
      init: function(fieldName, value){
      
      }
  }

_setState or _setValues
_setValue

_set({name: "value"}) // setState
_set('name', "value") // setValue

_describe({})
_describe('name')


***

Clone({})
_(obj, 'method',[arg1,argN])

._set()

// "$" meens "prototype":
var object$ = Object.prototype, array$ = Array.prototype;
object$._clone();
object$.clone_();
object$.clone$();
object$.$clone();

Clone.prototype._apply(obj,'method',[])

 //// Object literal: _({})        == object$._clone({})
 ////?      Function: _(Array)    === Array.prototype
 ////   Native value: _(23)        == object$.constructor(23) == Clone(23) == Object(23) == Number(23)
 ////    Method call: _(obj,'method',[]) == object$._apply
 ////?  Other object: _(new Array) == object$._clonify(new Array) // ._setRoot($object)
 // Clone({})        == new Clone({})         == _object.clone({})
 // Clone(new Array) == new Clone(new Array)  == // clonify()
 // Clone(23)        == new Clone(23)         == Object(23)
 // Clone(Array)     !=
 // Clone(this, 'getPrototypes') !=


    
// function configs (affect all next function calls):
Clone._extend.createType = true;
Clone._describe.defaultDescriptor = {configurable: true, enumerable: true, writable: true};
Clone._describe.modifiers = {
   init: function(fieldName, value){
  
   },
   _constructor_: function(value){
   
   },
   _accessor_: function(fieldName, value){
      
   },
}

_get()
_get(['p1','p2'])
_get(['p1','p2'], true, false)
_get(true, false)
_getValues() // returns array (not object-hash)

*/