// nodeunit

this.tests = {

    clone: {
        _1arg: function(test){
            var p = {p:{}};
            var c = clone(p);

            test.strictEqual( Object.getPrototypeOf(c), p);
            test.ok(!c.hasOwnProperty('p') );
            test.equal( Object.getOwnPropertyNames(c).length, 0);
            test.strictEqual(c.p, p.p);

            test.done();
        },
        
        _2args: function(test){
            var p = {p:{}}, s = {s:{}};
            var c = clone(p,s);

                test.strictEqual( Object.getPrototypeOf(c), p);
                test.ok( c.hasOwnProperty('s') );
                test.ok(!c.hasOwnProperty('p') );
                test.equal( Object.getOwnPropertyNames(c).length, 1);
                test.strictEqual(c.p, p.p);
                test.strictEqual(c.s, s.s);

            test.done();        
        },
        
//        _3args: function(test){
//            var p = {p:{name:"proto"}}, s = {s:{name:"state"}}, b = {b:{name:"behavior"}};
//            var c = clone(p,s,b);
//
////                //test.strictEqual( Object.getPrototypeOf(c), b);
////                test.ok( b.isPrototypeOf(c) );
////                //test.strictEqual( Object.getPrototypeOf(b), p);
////                test.ok( p.isPrototypeOf(b) );
//                test.ok( p.isPrototypeOf(c) );
//                test.ok( c.hasOwnProperty('s') );
//                test.ok(!c.hasOwnProperty('p') );
//                test.ok(!c.hasOwnProperty('b') );
//                test.equal( Object.getOwnPropertyNames(c).length, 1);
//                test.strictEqual(c.p, p.p);
//                test.strictEqual(c.s, s.s);            
//                test.strictEqual(c.b, b.b);            
//               
//            test.done();        
//        },

        $inits: function(test){
            getterCalls = 0;
            var state, obj = clone.create({
                thisCalls: 0
                },{
                $inits: {
                    getterOnce: function(){
                        this.thisCalls++;
                        getterCalls++;
                        return 'G';
                    }  
                }
            });
//console.log(obj.getterOnce.valueOf());
            test.equal(obj.getterOnce, 'G');
            test.equal(obj.getterOnce, 'G');
            test.equal(obj.getterOnce.valueOf(), 'G');
            test.equal(getterCalls, 1);
            //if(Object.defineProperty && Object.defineProperty.name){// !== _shimDefineProperty
                test.equal(obj.thisCalls, 1);
            //}

            test.done();
        },

        create: function(test){
            var c = clone.create({a:1});
            test.ok( c.hasOwnProperty('a') );
//            test.equal( Object.getPrototypeOf(c), clone.prototype);
            test.strictEqual( Object.getOwnPropertyNames(c).length, 1);

            test.done();
        }

    }
};


if(! Object.getOwnPropertyNames )
Object.getOwnPropertyNames = function(obj){
    var names = [];
    for(var name in obj) if( obj.hasOwnProperty(name) ){
        names.push(name);
    }
    return names;
}


//var behavior1$ = {
//    __inits__: {},
//    __defaults__: {},
//    __extends__: Object
//}
//var behavior2$ = {
//    $: {
//        inits: {},
//        defaults: {},
//        extends$: Object
//    }
//}
//var behavior3$ = {
//    extends$: Object,
//    $fields: {
//        field: "default value",
//        lazy: function(){
//
//        },
//        __proto__: Object
//    },
//    method: function(){
//
//    },
//    __proto__: this.$fields
//}
//
//var myClass$ = {
//    extends$: Object,
//    $fields: {
//        field: "default value"
//    },
//    $inits: {
//        lazy: function(){
//
//        }
//    },
//    method: function(){
//
//    }
//}
//
//var instance = Clone($parent);
//var instance = Clone($parent, {field: "value"});
//var instance = Clone.create({field: "value"});
//var child$   = Clone.extend({$fields: {field: "default value"});
//var child$   = Clone.extend($parent, {$fields: {field: "default value"}});
//
//new Clone({})
//Clone.create({})
//Clone.Dict({})

//var behavior31$ = {
//    $fields: {
//        extends$: Object,
//        field: "default value",
//        lazy: function(){
//            
//        },
//        __proto__: Object
//    },
//    method: function(){
//        
//    },
//    __proto__: this.$defaults
//}
//
//var behavior4$ = {
//    __proto__: Object,
//    $fields: {
//        field: "default value",
//        lazy: function(){
//            
//        },
//        __proto__: behavior4$
//    },
//    method: function(){
//        
//    },
//    __proto__: this.$defaults
//}