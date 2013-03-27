## [clone.js][]

This is the micro-framework that implements the true [prototype-based OOP⠙][1] in JS.  
It's based on the ECMA Script 5 features like [Object.create⠙][] and [property descriptors⠙][Object.defineProperty⠙].
<!--- HIDDEN: -->
[Download clonejs-latest.zip](http://github.com/quadroid/clonejs/archive/master.zip)
<!--- /HIDDEN -->

### See [API Documentation](http://clonejs.org/symbols/%24object.html)

The main difference with other class-producing tools like `Ext.define`, `dojo.declare`, `Backbone.Model.extend`
is that `$object.clone` will return an object (prototype with defined constructor-function) instead of function (with defined prototype-object).  
So, you don't need for instantiation, you can just start using the cloned object right now.  
But, if you need more than one instance, you can create it by `$yourProto.create`.


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
                        constructor : function MyType(){
                                          this.applySuper(arguments);
                                          // do something...
                                      }
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
            this.callParent('constructor', arg);
        }
    });
    var $grandchild = $child.clone({
        constructor: function Grandchild(){
            console.log('$grandchild constructor arguments:', arguments);
            this.applyParent(arguments);
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



[1]: http://en.wikipedia.org/wiki/Prototype-based_programming

[Object.create⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
[Object.defineProperty⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty

[clone.js]:    http://clonejs.org/
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

<!--- HIDDEN: -->
![yandex metrika](http://mc.yandex.ru/watch/20738752)
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)
<!--- /HIDDEN -->