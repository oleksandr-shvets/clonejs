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

     var $myType = $object.clone({
         '(final)  notConfigurableAndNotWritable': true,
         '(writable final)   notConfigurableOnly': null,
         '(hidden final get) notEnumerableGetter': function(){},
         '(hidden)                 notEnumerable': true,
         '(const)                       constant': 'not writable',
                                  publicProperty : 1,
                                           _item : null,// private property (not enumerable)
                                     '(get) item': function() { return this._item },
                                     '(set) item': function(v){ this._item = v },
                      '(get) publicPropertyAlias': 'publicProperty',// automatically create getter for publicProperty
                                     constructor : function MyType(){
                                                       this.applySuper(arguments);
                                                       // do something...
                                                   }
     });
     var myTypeInstance = $myType.create({publicProperty: 2}/* constructor argument */);
     assert( $myType.isPrototypeOf(myTypeInstance) );
     assert( $myType.publicPropertyAlias === $myType.publicProperty );


[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)