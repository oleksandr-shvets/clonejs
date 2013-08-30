<!-- HIDDEN: -->
## cloneJS [![Build Status](https://travis-ci.org/quadroid/clonejs.png?branch=master "travis-ci.org")](https://travis-ci.org/quadroid/clonejs) [![NPM version](https://badge.fury.io/js/clonejs.png)](http://badge.fury.io/js/clonejs)  
[CloneJS.org](http://clonejs.org)
|  [**Nano**](http://github.com/quadroid/clonejs-nano)
|  [API documentation](http://clonejs.org/symbols/clone.html)
|  [ChangeLog](https://github.com/quadroid/clonejs/blob/master/CHANGELOG.md)
|  [GitHub](http://github.com/quadroid/clonejs)
|  [NPM package](http://npmjs.org/package/clonejs)
|  [Travis CI](http://travis-ci.org/quadroid/clonejs)
<!-- /HIDDEN -->
  
**This framework provides:**

* Speed! It's extremely fast! [Faster than JS core!][jsperf] (class-objects creation).
* Class-less, the pure prototype-based paradigm.
* [Lazy initialization⠙][] support (by [$inits][] behavior).
* Separation of all your objects into the state (data) and behavior (methods),  
  as in ECMA Script 6: classes does not have fields, only methods.
* IE6 support! + Emulation of `Object.getPrototypeOf` (partial) and `Object.create`.

[Lazy initialization⠙]: http://martinfowler.com/bliki/LazyInitialization.html
[jsperf]: http://jsperf.com/object-properties-init/4
[$inits]: http://clonejs.org/symbols/clone.behavior$.html#$inits

### What is the Clone?

`clone` function produces new objects — Clones.  
**Clone object — this is the lazy shallow copy**, i.e., it is actually not a copy, it's just a reference to the object,
with one difference: if you will add/replace any of its properties, it would not affect the cloned object (prototype).  
All JavaScript objects are clones of `Object.prototype` (except itself and objects, created by `Object.create(null)`). 

### Try the true prototype-based OOP

With this framework you can easilly create and manipulate objects without constructors, instead of classic js way,
where you should define a constructor for every object (that you want to use as prototype), even if you didn't need it.
It's possible to build and maintain extremely **large numbers of "classes" with comparatively little code**.

**It's trivial to create new "classes"** - just clone the object and change a couple of properties and voila... new "class".

**It's really class-free**: `clone()` produces objects (prototypes), not function-constructors, unlike all other class-producing tools (`Ext.define`, `dojo.declare` etc).

Read more:

- [Advantages of prototype-based OOP⠙](http://programmers.stackexchange.com/questions/110936/what-are-the-advantages-of-prototype-based-oop-over-class-based-oop#answers-header)
by Mike Anderson
- [Does JavaScript need classes? (in russian)⠙](http://habrahabr.ru/post/175029/) [(robot translation)⠙](http://translate.google.com/translate?hl=&sl=ru&tl=en&u=http%3A%2F%2Fhabrahabr.ru%2Fpost%2F175029%2F)
<<<<<<< HEAD
by [Me](//github.com/quadroid)
=======
by Me (Alexander Shvets)
>>>>>>> a369ad4f450b542d214cf284280c1dbdc05caf02
- [Myth: JavaScript needs classes⠙](http://www.2ality.com/2011/11/javascript-classes.html)
by [Dr. Axel Rauschmayer (University of Munich)⠙](http://rauschma.de)
- [JS Objects: De”construct”ion⠙](http://davidwalsh.name/javascript-objects-deconstruction)
by Kyle Simpson
- [Stop Using Constructor Functions In JavaScript⠙](http://ericleads.com/2012/09/stop-using-constructor-functions-in-javascript/)
by [Eric Elliott (Adobe)⠙](http://ericleads.com/about/)
- [Constructors Are Bad For JavaScript⠙](http://tareksherif.ca/blog/2013/08/constructors-are-bad-for-javascript/)
by Tarek Sherif

### Installation

Node.js:

    npm install clonejs

[CDN⠙][] for client-side:

    <script src="http://quadroid.github.io/clonejs/cdn/clone.min.js"></script>

### Usage

    var clone = require('clonejs');//</node.js>
        
    /// Forget about classes.    
    //  Instead of creating class (function), create prototype (object):
    
    var duck$ = { // $ postfix means prototype: Duck.prototype === duck$
        quack: function(){
            console.log( this.name +" Duck: Quack-quack!");
        }
    };

    /// Inheritance is simple (talkingDuck prototype extends duck prototype):
    
    var talkingDuck$ = clone.extend( duck$, {
        quack: function(){
            duck$.quack.call(this);
            console.log("My name is "+ this.name +"!");
        }
    });
    
    /// Forget about the `new` operator, use `clone` function to create instances:
    
    var donald = clone( talkingDuck$, {name: "Donald"});
    donald.quack();// Donald Duck: Quack-quack! 
                   // My name is Donald!
    var daffy  = clone( talkingDuck$, {name: "Daffy"});
    daffy.quack(); // Daffy Duck: Quack-quack! 
                   // My name is Daffy!

    /// Forget about the `instanceof` operator, use JS native 
    //  .isPrototypeOf() method instead:
    
    duck$.isPrototypeOf(donald);// true

##### Object-oriented notation:
      
      var duck$ = clone.extend({
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

    var obj = clone.new({
        name: "object"
        },{
        $inits: {
            lazy: function(){
                console.log("Lazy initialization...");
                return this.name +" lazy initiated.":
            }
        }
    });
    
    console.log( "obj.lazy: " + obj.lazy );
    // Lazy initialization...
    // obj.lazy: object lazy initiated.
    
    console.log( "obj.lazy: " + obj.lazy );// initializer does't run again
    // obj.lazy: object lazy initiated.

This code will work on IE8-, but you need to remember:

###### Internet Explorer 8– obsticles
    
Your accessor function **should not return** `null` or `undefined`.  
**If accessor returns boolean**, you need to compare it with `true` or `false` obviously:

    if( obj.lazyBoolean == true   ) console.log(true);
    // or
    if( obj.lazyBoolean.valueOf() ) console.log(true);

**If accessor returns object**, you need to call `valueOf()` method:

    console.log( obj.lazyObject.valueOf().name );
    
    // for info, this will works without errors/warnings on all browsers:
    console.log( ({name: "obj.property" }).valueOf().name );// obj.property
    console.log( (function(){return "fn"}).valueOf()()    );// fn
    console.log( (777).valueOf() );// 777
    console.log( "str".valueOf() );// str
    console.log( false.valueOf() );// false
    // but this will throw error:
    console.log( (undefined).valueOf() );
    console.log(      (null).valueOf() );
    
You can call `valueOf()` method only on first access.   
**If accessor returns primitive value** (string, number, boolean), you can use it as normal.  
JavaScript automatically invokes `valueOf()` in places where a primitive value is expected.

<<<<<<< HEAD
-----

##### For more details, see [API documentation](http://clonejs.org/symbols/clone.html)
=======
----
For more details, see [API documentation](http://clonejs.org/symbols/clone.html)
>>>>>>> a369ad4f450b542d214cf284280c1dbdc05caf02
  
  
[clone]: http://clonejs.org/symbols/clone.html#clone
[create]: http://clonejs.org/symbols/clone.html#create

[Object.create⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
[Object.defineProperty⠙]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty
[property descriptors⠙]: http://ejohn.org/blog/ecmascript-5-objects-and-properties/#ig-sh-1

[CDN⠙]: http://code.lancepollard.com/github-as-a-cdn/

<!-- HIDDEN: -->
![yandex metrika](http://mc.yandex.ru/watch/20738752)
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/3110be9614da5cb337ebd483c187010f "githalytics.com")](http://githalytics.com/quadroid/clonejs)
<!-- /HIDDEN -->
