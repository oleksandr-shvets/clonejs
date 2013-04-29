<!-- HIDDEN: -->
## CloneJS [![Build Status](https://travis-ci.org/quadroid/clonejs.png?branch=master "travis-ci.org")](https://travis-ci.org/quadroid/clonejs) [![NPM version](https://badge.fury.io/js/clonejs.png)](http://badge.fury.io/js/clonejs)
[**CloneJS.org**](http://clonejs.org)
|  [API documentation](http://clonejs.org/symbols/%24object.html)
|  [ChangeLog](https://github.com/quadroid/clonejs/blob/master/CHANGELOG.md)
*|  [GitHub](http://github.com/quadroid/clonejs)
|  [NPM package](http://npmjs.org/package/clonejs)
|  [Travis CI](http://travis-ci.org/quadroid/clonejs)*
<!-- /HIDDEN -->

This framework based on the ECMA Script 5 features like [Object.create⠙][] and [property descriptors⠙][].
So, it isn't supported by IE8, but now, finally, you can use property descriptors, getters and setters!  
  
**This framework provides:**

* Class-less, the pure prototype-oriented paradigm.
* [Lazy initialization⠙][] support (by `get/set once` modifier).
* Easy creation of special properties: getters/setters, runned only once accessors, constants, "final" (unconfigurable) and "hidden" (unenumerable) properties.
* Power object creation tools: [clone][], [copy][], [deepCopy][], [deepClone][], [create][].
* Object properties iteration, like arrays: [forEach][], [map][], [filter][], [every][], [some][].
* [applySuper][] method to easy and inheritance safe call parent prototype methods.
* Object modify methods ([concat][], [paste][]), which preserve property descriptors state. 

[Lazy initialization⠙]: http://en.wikipedia.org/wiki/Lazy_initialization

#### Try the true [prototype-based OOP⠙](http://en.wikipedia.org/wiki/Prototype-based_programming)

**It's trivial to create new "classes"** - just clone the object and change a couple of properties and voila... new "class".

**It's really class-free**: `$object.clone` produces prototype objects, not function-constructors, unlike other class-producing tools (`Ext.define`, `dojo.declare`).

In this framework you can easilly create and manipulate objects without constructors, instead of classic js way,
where you should define a constructor for every object (that you want to use as prototype), even if you didn't need it.
It's possible to build and maintain extremely **large numbers of "classes" with comparatively little code**.

See more:

- [Advantages of prototype-based OOP⠙](http://programmers.stackexchange.com/questions/110936/what-are-the-advantages-of-prototype-based-oop-over-class-based-oop#answers-header)
- [Myth: JavaScript needs classes⠙](http://www.2ality.com/2011/11/javascript-classes.html)

### Installation

Node.js:

    npm install clonejs

[CDN⠙][] for client-side (~3 KB gzipped):

    <script src="http://quadroid.github.io/clonejs/cdn/clone.min.js"></script>
    
###### Injected mode

    <script>var clonejs = {inject: Object.prototype}</script>
    <script src="http://quadroid.github.io/clonejs/cdn/clone.min.js"></script>

### Usage

    //<node.js>
    var clonejs = require('clonejs'),
        $object = clonejs.$object;
    //or: var $object = require('clonejs').$object;
    //or: require('clonejs').inject();
    //</node.js>
        
    /// Forget about classes.    
    //  Instead of creating class (function), create prototype (object):
    var $duck = $object.clone({
        name: 'Unnamed',
        quack: function(){
            console.log( this.name +' Duck: Quack-quack!');
        }
    });
    $duck.quack();//Unnamed Duck: Quack-quack!
        
    /// Inheritance is simple: 
    var $talkingDuck = $duck.clone({
        quack: function(){
            this.applySuper('quack');
            console.log('My name is '+ this.name +'!');
        }       
    });
    
    /// Forget about the `new` operator, use .create() method instead:
    var donald = $talkingDuck.create({name: 'Donald'});
    donald.quack();// Donald Duck: Quack-quack! 
                   // My name is Donald!

    /// Forget about the `instanceof` operator, use JS native 
    //  .isPrototypeOf() method instead:
    $duck.isPrototypeOf(donald);// true



###### Cloning objects:

    var $proto  = $object.clone({a:1, b:2, c:3});
    
    /// clone:
    var clone   = $proto.clone();
        clone.a = 11; // $proto.a not changed
       $proto.b = 22; // clone.b will be also changed to 22
        
    ///  copy: 
    var  copy   = $proto.copy();
         copy.a = 111;// $proto.a not changed
       $proto.b = 222;// copy.b not changed  
    
    /// create:
    var instance   = $proto.create({d: 4444});
        instance.a = 1111;// $proto.a not changed
          $proto.b = 2222;// like clone, instance.b will be also changed to 2222
    console.log( instance.a );// 1111
    console.log( instance.d );// 4444
        
See: [clone][], [copy][], [create][], [deepCopy][], [deepClone][].

###### Property modificators:

    var $myType = $object.clone({
                        constructor : "MyType",
                          property0 : "simple property",
        '(final)          property1': "not configurable and not writable",
        '(writable final) property2': "not configurable only",
        '(hidden)         property3': "not enumerable",
        '(const)           constant': "not writable",
        '(get)       property3alias': 'property3',// automatically create getter
                              _item : "private property (not enumerable)",
                       '(get)  item': function() { return this._item },
                       '(set)  item': function(v){ this._item = v    },
                  '(get once)  once': function() {
                                          console.log('getter called');
                                          return this.property0;
                                      }
    });
    
    console.log( $myType.property3alias === $myType.property3 );// true 
    
    console.log( $myType.once );// getter called
                                // simple property
                                
    console.log( $myType.once );// simple property

See: [describe][].

###### Inheritance & constructors:
        
    var $parent = $object.clone({
        constructor: function Parent(){
            this.applySuper();
            console.log('$parent constructor arguments:', arguments);
        }
    });
        
    var $child = $parent.clone({
        constructor: function Child(arg1, arg2){
            this.callSuper('constructor', arg1, arg2);
            console.log('$child constructor arguments:', arguments);
        }
    });
        
    var $grandchild = $child.clone({
        constructor: function Grandchild(){
            this.applySuper(arguments);
            console.log('$grandchild constructor arguments:', arguments);
        }
    });
        
    var myBoy = $grandchild.create(1,2,3);
    /// console log:
        // $parent constructor arguments: [1,2]
        // $child constructor arguments: [1,2,3]
        // $grandchild constructor arguments: [1,2,3]
        
    console.log( $child.isPrototypeOf(myBoy) );// true

See: [constructor][], [create][], [applySuper][], [callSuper][], [createSuperSafeCallback][].

###### Properties iteration:

    var $obj = $object.clone({a: 11, b: 22, c: 33}),
         obj = $obj.create({d: 44});

    /// Map only own properties (default):
        
    var mappedObj1 = obj.map(function(value){return 100 + value});
        // mappedObj1 == {d: 144}

    /// Map all properties, replace default (`$object`) prototype of returned object:
        
    var proto = {e: 55};
    var mappedObj2 = obj.map(function(value){return 100 + value}, obj, false, proto);
        // mappedObj2 == {a: 111, b: 122, c: 133, d: 144, e: 155}
    proto.f = 66;
        // mappedObj2 == {a: 111, b: 122, c: 133, d: 144, e: 155, f: 66}

See: [forEach][], [map][], [filter][], [every][], [some][].

###### Namespaces:
        
    var app = clonejs.$namespace.create();
    
    /// create namespace item `app.collections`
        
    app.extend('collections', {
        $item:  {},
        _items: {}
    });

    /// create namespace item `app.collections.arrayCollections`

    app.collections.extend('arrayCollections', {_items: []});

    /// create namespace item  `app.models.users`
    
    var $users = app.collections.$arrayCollections.clone({
        $item: {name: '', isAdmin: false},
        constructor: function Users(items){
            items.forEach(function(item){
                var newItem = $object.create.call(this.$item, item);
                this._items.push(newItem);
            }, this);
        }
    });
    app.put('models.users', $users);
        
    /// use namespace:

    var users = app.models.$users.create([{name: 'User1'}]);

See: [$namespace][], [$namespace.extend][], [$namespace.put][].



[Object.create⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
[Object.defineProperty⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty
[property descriptors⠙]: http://ejohn.org/blog/ecmascript-5-objects-and-properties/#ig-sh-1

[CDN⠙]: http://code.lancepollard.com/github-as-a-cdn/

[$object]:     http://clonejs.org/symbols/%24object.html

[clone]:       http://clonejs.org/symbols/%24object.html#clone
[create]:      http://clonejs.org/symbols/%24object.html#create
[copy]:        http://clonejs.org/symbols/%24object.html#copy
[deepCopy]:    http://clonejs.org/symbols/%24object.html#deepCopy
[deepClone]:   http://clonejs.org/symbols/%24object.html#deepClone

[describe]:    http://clonejs.org/symbols/%24object.html#.describe

[forEach]:     http://clonejs.org/symbols/%24object.html#forEach
[every]:       http://clonejs.org/symbols/%24object.html#every
[some]:        http://clonejs.org/symbols/%24object.html#some
[map]:         http://clonejs.org/symbols/%24object.html#map
[filter]:      http://clonejs.org/symbols/%24object.html#filter

[concat]:      http://clonejs.org/symbols/%24object.html#concat
[paste]:       http://clonejs.org/symbols/%24object.html#paste

[constructor]: http://clonejs.org/symbols/%24object.html#constructor
[applySuper]:  http://clonejs.org/symbols/%24object.html#applySuper
[callSuper]:   http://clonejs.org/symbols/%24object.html#callSuper
[createSuperSafeCallback]: http://clonejs.org/symbols/%24object.html#createSuperSafeCallback

[$namespace]:          http://clonejs.org/symbols/$namespace.html
[$namespace.extend]:   http://clonejs.org/symbols/$namespace.html#extend
[$namespace.put]:      http://clonejs.org/symbols/$namespace.html#put

<!-- HIDDEN: -->
![yandex metrika](http://mc.yandex.ru/watch/20738752)
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)
<!-- /HIDDEN -->