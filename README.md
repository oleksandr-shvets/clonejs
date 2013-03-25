## [clone.js][]

This is the micro-framework that implements the true [prototype-based OOP⠙][1] in JS.  
It's based on the new ECMA Script 5 features like [`Object.create`⠙][2] and [property descriptors⠙][3].
  [1]: http://en.wikipedia.org/wiki/Prototype-based_programming
  [2]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
  [3]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty

[Download clonejs-latest.zip](http://github.com/quadroid/clonejs/archive/master.zip)

### See [API Documentation](http://quadroid.github.com/clonejs/symbols/%24object.html)

The main difference with other class-producing tools like `Ext.define`, `dojo.declare`, `Backbone.Model.extend`
is that `$object.clone` will return an object (prototype with defined constructor-function) instead of function (with defined prototype-object). So, you don't need for instantiation, you can just start using the cloned object right now. But, if you need more than one instance, you can create it by `$yourProto.create`.


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

    var myTypeInstance = $myType.create({property4: "initialize simple property"});
        assert( $myType.isPrototypeOf(myTypeInstance) );

See: [constructor][], [create][], [applySuper][], [callSuper][], [createSuperSafeCallback][].

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

[clone.js]:    http://quadroid.github.com/clonejs/
[$object]:     http://quadroid.github.com/clonejs/symbols/%24object.html

[clone]:       http://quadroid.github.com/clonejs/symbols/%24object.html#clone
[create]:      http://quadroid.github.com/clonejs/symbols/%24object.html#create
[copy]:        http://quadroid.github.com/clonejs/symbols/%24object.html#copy
[deepCopy]:    http://quadroid.github.com/clonejs/symbols/%24object.html#deepCopy
[deepClone]:   http://quadroid.github.com/clonejs/symbols/%24object.html#deepClone
[describe]:    http://quadroid.github.com/clonejs/symbols/%24object.html#.describe
[constructor]: http://quadroid.github.com/clonejs/symbols/%24object.html#constructor
[applySuper]:  http://quadroid.github.com/clonejs/symbols/%24object.html#applySuper
[callSuper]:   http://quadroid.github.com/clonejs/symbols/%24object.html#callSuper
[createSuperSafeCallback]: http://quadroid.github.com/clonejs/symbols/%24object.html#createSuperSafeCallback

[ns]:          http://quadroid.github.com/clonejs/symbols/ns.html
[ns.extend]:   http://quadroid.github.com/clonejs/symbols/ns.html#extend
[ns.put]:      http://quadroid.github.com/clonejs/symbols/ns.html#put


[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)