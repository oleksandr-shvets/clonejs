<!-- HIDDEN: -->
## CloneJS [![Build Status](https://travis-ci.org/quadroid/clonejs.png?branch=master "travis-ci.org")](https://travis-ci.org/quadroid/clonejs) [![NPM version](https://badge.fury.io/js/clonejs.png)](http://badge.fury.io/js/clonejs)
[**CloneJS.org**](http://clonejs.org)
|  [API documentation](http://clonejs.org/symbols/clone.html)
|  [ChangeLog](https://github.com/quadroid/clonejs/blob/master/CHANGELOG.md)
*|  [GitHub](http://github.com/quadroid/clonejs)
|  [NPM package](http://npmjs.org/package/clonejs)
|  [Travis CI](http://travis-ci.org/quadroid/clonejs)*
<!-- /HIDDEN -->
  
**This framework provides:**

* Speed! It's extrimerly fast!
* Class-less, the pure prototype-oriented paradigm.
* Separate all your objects and classes to state (data) and behavior (methods).
* [Lazy initialization⠙][] support (by `__inits__` behavior).
* IE6+ support! Shims `Object.create` and `Object.getPrototypeOf` methods.

[Lazy initialization⠙]: http://en.wikipedia.org/wiki/Lazy_initialization

The main code of the framework:

    function clone(/** Object! */obj, /** object! */state, /** object= */behavior$){
        if( behavior$ ){
            behavior$.__proto__ = obj;
            state.__proto__ = behavior$;
        }else{
            state.__proto__ = obj;
        }
        return state;
    }

Thats it!

#### Try the true [prototype-based OOP⠙](http://en.wikipedia.org/wiki/Prototype-based_programming)

**It's trivial to create new "classes"** - just clone the object and change a couple of properties and voila... new "class".

**It's really class-free**: `clone` produces prototype objects, not function-constructors, unlike other class-producing tools (`Ext.define`, `dojo.declare`).

In this framework you can easilly create and manipulate objects without constructors, instead of classic js way,
where you should define a constructor for every object (that you want to use as prototype), even if you didn't need it.
It's possible to build and maintain extremely **large numbers of "classes" with comparatively little code**.

See more:

- [Advantages of prototype-based OOP⠙](http://programmers.stackexchange.com/questions/110936/what-are-the-advantages-of-prototype-based-oop-over-class-based-oop#answers-header)
- [Myth: JavaScript needs classes⠙](http://www.2ality.com/2011/11/javascript-classes.html)

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
    
    /// Forget about the `new` operator, use clone to create instances:
    
    var donald = clone(talkingDuck$, {name: "Donald"});
    donald.quack();// Donald Duck: Quack-quack! 
                   // My name is Donald!
    var daffy = clone(talkingDuck$, {name: "Daffy"});
    daffy.quack(); // Daffy Duck: Quack-quack! 
                   // My name is Daffy!

    /// Forget about the `instanceof` operator, use JS native 
    //  .isPrototypeOf() method instead:
    
    duck$.isPrototypeOf(donald);// true


###### Lazy initialization:

Instead of defining in constructor, you can initialize your properties separetly.
Lazy initialization is the tactic, that will initialize property in first use of them.

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
    
    console.log( obj.lazy );// initializer don't run again
    // Default Name: Lazy initiated.

[Object.create⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
[Object.defineProperty⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty
[property descriptors⠙]: http://ejohn.org/blog/ecmascript-5-objects-and-properties/#ig-sh-1

[CDN⠙]: http://code.lancepollard.com/github-as-a-cdn/

<!-- HIDDEN: -->
![yandex metrika](http://mc.yandex.ru/watch/20738752)
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)
<!-- /HIDDEN -->