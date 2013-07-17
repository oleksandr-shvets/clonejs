<!-- HIDDEN: -->
## CloneJS [![Build Status](https://travis-ci.org/quadroid/clonejs.png?branch=master "travis-ci.org")](https://travis-ci.org/quadroid/clonejs) [![NPM version](https://badge.fury.io/js/clonejs.png)](http://badge.fury.io/js/clonejs)  
[**CloneJS.org**](http://clonejs.org)
|  [API documentation](http://clonejs.org/symbols/clone.html)
|  [ChangeLog](https://github.com/quadroid/clonejs/blob/master/CHANGELOG.md)
|  [GitHub](http://github.com/quadroid/clonejs)
|  [NPM package](http://npmjs.org/package/clonejs)
|  [Travis CI](http://travis-ci.org/quadroid/clonejs)
<!-- /HIDDEN -->
  
**This framework provides:**

* Speed! It's extremely fast! [Faster than JS core class creation!][jsperf]
* Class-less, the pure prototype-based paradigm.
* [Lazy initialization⠙][] support (by `__inits__` behavior).
* Separation of all your objects into the state (data) and behavior (methods),  
  as in ECMA Script 6: classes does not have fields, only methods.
* IE6 support! + Emulation of `Object.getPrototypeOf` (partial) and `Object.create`.
 

[Lazy initialization⠙]: http://martinfowler.com/bliki/LazyInitialization.html
[jsperf]: http://jsperf.com/object-properties-init/4

This is the main code of the framework (ECMA Script 6 only version):

    function clone(/** Object! */obj, /** object! */state, /** object= */behavior$){
        if( behavior$ ){
            behavior$.__proto__ = obj;
            state.__proto__ = behavior$;
        }else{
            state.__proto__ = obj;
        }
        return state;
    }

That's it!

#### What is the clone?

`clone` function produces new objects — clones.  
**Clone — this is the lazy shallow copy**, ie, it is actually not a copy, it's just a reference to the object,
with one difference: if you will add/replace any of its properties, it would not affect the cloned object (prototype).

#### Try the true [prototype-based OOP⠙](http://en.wikipedia.org/wiki/Prototype-based_programming)

In this framework you can easilly create and manipulate objects without constructors, instead of classic js way,
where you should define a constructor for every object (that you want to use as prototype), even if you didn't need it.
It's possible to build and maintain extremely **large numbers of "classes" with comparatively little code**.

**It's trivial to create new "classes"** - just clone the object and change a couple of properties and voila... new "class".

**It's really class-free**: `clone` produces objects (prototypes), not function-constructors, unlike all other class-producing tools (`Ext.define`, `dojo.declare` etc).

Read more:

- [Advantages of prototype-based OOP⠙](http://programmers.stackexchange.com/questions/110936/what-are-the-advantages-of-prototype-based-oop-over-class-based-oop#answers-header)
- [Myth: JavaScript needs classes⠙](http://www.2ality.com/2011/11/javascript-classes.html)
- [Does JavaScript need classes? (robot translation, sorry)⠙](http://translate.google.com/translate?hl=&sl=ru&tl=en&u=http%3A%2F%2Fhabrahabr.ru%2Fpost%2F175029%2F)

### Installation

Node.js:

    npm install clonejs

[CDN⠙][] for client-side:

    <script src="http://quadroid.github.io/clonejs/cdn/clone.min.js"></script>

### Usage

    var clone = require('clonejs');//</node.js>
        
    /// Forget about classes.    
    //  Instead of creating class (function), create prototype (object):
    
    var duck$ = {
        quack: function(){
            console.log( this.name +" Duck: Quack-quack!");
        }
    };

    /// Inheritance is simple (talkingDuck$ extends duck$):
    
    var talkingDuck$ = clone(duck$, {
        quack: function(){
            duck$.quack.call(this);
            console.log("My name is "+ this.name +"!");
        }
    });
    
    /// Forget about the `new` operator, use `clone` function to create instances:
    
    var donald = clone(talkingDuck$, {name: "Donald"});
    donald.quack();// Donald Duck: Quack-quack! 
                   // My name is Donald!
    var daffy  = clone(talkingDuck$, {name: "Daffy"});
    daffy.quack(); // Daffy Duck: Quack-quack! 
                   // My name is Daffy!

    /// Forget about the `instanceof` operator, use JS native 
    //  .isPrototypeOf() method instead:
    
    duck$.isPrototypeOf(donald);// true

##### Object-oriented notation:

      var object$ = clone.prototype;
      
      var duck$ = object$.$clone({
          quack: function(){
              console.log( this.name +" Duck: Quack-quack!");
          }
      });
        
      var talkingDuck$ = duck$.$extend({
          quack: function(){
              duck$.quack.call(this);
              console.log("My name is "+ this.name +"!");
          }
      });
            
      var donald = talkingDuck$.$clone({name: "Donald"});
      var daffy  = talkingDuck$.$clone({name: "Daffy"});

#### Lazy initialization

How to initialize object without constructor?  
Lazy initialization is the tactic of delaying the calculation of a value until the first time it is needed.

    var obj = clone.create({
        name: "Default Name"
        },{
        __inits__: {
            lazy: function(){
                console.log("Lazy initialization...");
                return this.name +": Lazy initiated.":
            }
        }
    });
    
    console.log( obj.lazy );
    // Lazy initialization...
    // Default Name: Lazy initiated.
    
    console.log( obj.lazy );// initializer does't run again
    // Default Name: Lazy initiated.


    var myClass$ = clone.create({
        constructor: function MyClass(state){
            MyClass.Init.call(this, state);
        }
    });
    var myClass = new myClass$.constructor({});
    


[Object.create⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
[Object.defineProperty⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty
[property descriptors⠙]: http://ejohn.org/blog/ecmascript-5-objects-and-properties/#ig-sh-1

[CDN⠙]: http://code.lancepollard.com/github-as-a-cdn/

<!-- HIDDEN: -->
![yandex metrika](http://mc.yandex.ru/watch/20738752)
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)
<!-- /HIDDEN -->