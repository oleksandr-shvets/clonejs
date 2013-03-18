## clone.js

This is the framework that implements the true prototype-based OOP paradigm in JS.
It's based on the new ECMA Script 5 features like Object.create and property descriptors.

[Download](http://github.com/quadroid/clonejs/archive/master.zip)

### See [Documentation](http://quadroid.github.com/clonejs/symbols/%24object.html)

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
                                                       var obj = this._applySuper(arguments);
                                                       // do something with obj...
                                                       return obj;
                                                   }
     });
     var myTypeInstance = $myType.create({publicProperty: 2});
     assert( $myType.isPrototypeOf(myTypeInstance) );
     assert( $myType.publicPropertyAlias === $myType.publicProperty );
