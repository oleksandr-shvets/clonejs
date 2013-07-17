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
        
        _3args: function(test){
            var p = {p:{name:"proto"}}, s = {s:{name:"state"}}, b = {b:{name:"behavior"}};
            var c = clone(p,s,b);

//                //test.strictEqual( Object.getPrototypeOf(c), b);
//                test.ok( b.isPrototypeOf(c) );
//                //test.strictEqual( Object.getPrototypeOf(b), p);
//                test.ok( p.isPrototypeOf(b) );
                test.ok( p.isPrototypeOf(c) );
                test.ok( c.hasOwnProperty('s') );
                test.ok(!c.hasOwnProperty('p') );
                test.ok(!c.hasOwnProperty('b') );
                test.equal( Object.getOwnPropertyNames(c).length, 1);
                test.strictEqual(c.p, p.p);
                test.strictEqual(c.s, s.s);            
                test.strictEqual(c.b, b.b);            
               
            test.done();        
        },

        __inits__: function(test){
            var obj = clone.create({
                getterCalls: 0
                },{
                __inits__: {
                    getterOnce: function(){
                        this.getterCalls++;
                        return 'G';
                    }  
                }
            });

            test.equal(obj.getterOnce, 'G');
            test.equal(obj.getterOnce, 'G');
            test.equal(obj.getterOnce, 'G');
            test.equal(obj.getterCalls, 1);

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
