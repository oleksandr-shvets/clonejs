## [clone.js](http://clonejs.org) [![Build Status](https://travis-ci.org/quadroid/clonejs.png?branch=master "travis-ci.org")](https://travis-ci.org/quadroid/clonejs)
<!-- HIDDEN: -->
[API documentation](http://clonejs.org/symbols/%24object.html)
|  [GitHub](http://github.com/quadroid/clonejs)
|  [NPM package](http://npmjs.org/package/clonejs)
|  [Travis CI](http://travis-ci.org/quadroid/clonejs)
<!-- /HIDDEN -->

This is the micro-framework that based on the ECMA Script 5 features like [Object.create⠙][] and [property descriptors⠙][Object.defineProperty⠙].

##### Try the true [prototype-based OOP⠙](http://en.wikipedia.org/wiki/Prototype-based_programming)

**It's trivial to create new "classes"** - just clone the prototype and change a couple of properties and voila... new "class".

**It's really class-free**: do you know the difference between js constructor-functions and classes in other languages?
`$object.clone` produces prototype objects, not function-constructors, unlike other class-producing tools (`Backbone.Model.extend`, `Ext.define`, `dojo.declare`).

In this framework you can easilly create and manipulate objects without constructors, instead of js way,
where you should define a constructor for every object (that you want to use as prototype), even if you didn't need it.
It's possible to build and maintain extremely **large numbers of "classes" with comparatively little code**.

See more [advantages of prototype-based OOP⠙](http://programmers.stackexchange.com/questions/110936/what-are-the-advantages-of-prototype-based-oop-over-class-based-oop#answers-header).

### Installation

Node.js:

    npm install clonejs

[CDN⠙][] for client-side (~3 KB gzipped):

    <script src="http://quadroid.github.com/clonejs/cdn/clone.min.js" type="text/javascript"></script>

### Usage

Node.js:

    var ns = require('clonejs'),
        $object = ns.prototype;

###### Quick example (cloning):

    var $myProto = {a:1, b:2, c:3};
    var    clone = $object.clone.apply($myProto);
         clone.a = 11; // $myProto.a still == 1
      $myProto.b = 22; // clone.b will be also changed to 22

See: [clone][], [create][], [copy][], [deepCopy][], [deepClone][].

###### Property modificators:

    var $myType = $object.clone({
        '(final)          property1': "not configurable and not writable",
        '(writable final) property2': "not configurable only",
        '(hidden)         property3': "not enumerable",
        '(const)           constant': "not writable",
                          property4 : "simple property",
        '(get)       property3alias': 'property3',// automatically create getter
                              _item : "private property (not enumerable)",
                       '(get)  item': function() { return this._item },
                       '(set)  item': function(v){ this._item = v    },
                        constructor : 'MyType'
    });
    assert( $myType.property3alias === $myType.property3 );

See: [describe][].

###### Constructors & instantiation:
        
    var $parent = $object.clone({
        constructor: function Parent(){
            console.log('$parent constructor arguments:', arguments);
        }
    });
    var $child = $parent.clone({
        constructor: function Child(arg){
            console.log('$child constructor arguments:', arguments);
            this.callSuper('constructor', arg);
        }
    });
    var $grandchild = $child.clone({
        constructor: function Grandchild(){
            console.log('$grandchild constructor arguments:', arguments);
            this.applySuper(arguments);
        }
    });
    var grandchild = $grandchild.create(1,2,3);
        // will output:
        // $grandchild constructor arguments: [1,2,3]
        // $child constructor arguments: [1,2,3]
        // $parent constructor arguments: [1]
        
    assert( $child.isPrototypeOf(grandchild) );

See: [constructor][], [create][], [applySuper][], [callSuper][], [createSuperSafeCallback][].

###### Properties iteration:

    var $obj = $object.clone({a: 11, b: 22, c: 33}),
         obj = $obj.create({d: 44});

    var mappedObj = obj.map(function(value){return 100 + value}, obj, true);
        // mappedObj == {d: 144} // mapped only own property

    var proto = {e: 55};
    mappedObj = obj.map(function(value){return 100 + value}, obj, false, proto);
        // mappedObj == {a: 111, b: 122, c: 133, d: 144, e: 155}
    proto.f = 66;
        // mappedObj == {a: 111, b: 122, c: 133, d: 144, e: 155, f: 66}

See: [forEach][], [map][], [filter][], [every][], [some][].

###### Namespaces:

    ns.extend('collection', {
        $item:  {},
        _items: {}
    });
    ns.collection.extend('arrayCollection', {_items: []});
    
    var $users = ns.collection.$arrayCollection.clone({
        $item: {name: '', isAdmin: false},
        constructor: function Users(items){
            items.forEach(function(item){
                var newItem = $object.create.call(this.$item, item);
                this._items.push(newItem);
            }, this);
        }
    });
    ns.put('models.users', $users);

    var users = ns.models.$users.create([{name: 'User1'}]);

See: [ns][], [ns.extend][], [ns.put][].



[Object.create⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
[Object.defineProperty⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty

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

[constructor]: http://clonejs.org/symbols/%24object.html#constructor
[applySuper]:  http://clonejs.org/symbols/%24object.html#applySuper
[callSuper]:   http://clonejs.org/symbols/%24object.html#callSuper
[createSuperSafeCallback]: http://clonejs.org/symbols/%24object.html#createSuperSafeCallback

[ns]:          http://clonejs.org/symbols/ns.html
[ns.extend]:   http://clonejs.org/symbols/ns.html#extend
[ns.put]:      http://clonejs.org/symbols/ns.html#put

<!-- HIDDEN: -->
![yandex metrika](http://mc.yandex.ru/watch/20738752)
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)
<!-- /HIDDEN -->