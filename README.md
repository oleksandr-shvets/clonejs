## clone.js

This is the micro-framework that implements the true [prototype-based OOP⠙][1] in JS.  
It's based on the new ECMA Script 5 features like [`Object.create`⠙][2] and [property descriptors⠙][3].
  [1]: http://en.wikipedia.org/wiki/Prototype-based_programming
  [2]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
  [3]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty

[Download clonejs-latest.zip](http://github.com/quadroid/clonejs/archive/master.zip)

### See [API Documentation](http://quadroid.github.com/clonejs/symbols/%24object.html)

The main difference with other class-producing tools like `Ext.define`, `dojo.declare`, `Backbone.Model.extend`
is that `$object.clone` will return an object (prototype with defined constructor-function) instead of function (with defined prototype-object). So, you don't need for instantiation, you can just start using the cloned object right now. But, if you need more than one instance, you can create it by `$yourProto.create`.

Quick example:

    var myObj = {a:1, b:2, c:3};
    var cloneOfMyObj = $object.apply(myObj, 'clone');
      cloneOfMyObj.a = 11; // myObj.a still == 1
             myObj.b = 22; // cloneOfMyObj.b will be also changed to 22

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
    var myTypeInstance = $myType.create({property4: "initialize simple property"});
        assert( $myType.isPrototypeOf(myTypeInstance) );
        assert( $myType.property3alias === $myType.property3 );

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)