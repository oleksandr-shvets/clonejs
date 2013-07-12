// nodeunit

this.tests = {

    clone: {
        "1 arg": function(test){
            var p = {p:{}};
            var c = clone(p);

            test.strictEqual( Object.getPrototypeOf(c), p);
            test.ok(!c.hasOwnProperty('p') );
            test.equal( Object.getOwnPropertyNames(c).length, 0);
            test.strictEqual(c.p, p.p);

            test.done();
        },
        
        "2 args": function(test){
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
        
        "3 args": function(test){
            var p = {p:{}}, s = {s:{}}, b = {b:{}};
            var c = clone(p,s,b);

                test.strictEqual( Object.getPrototypeOf(c), b);
                test.strictEqual( Object.getPrototypeOf(b), p);
                test.ok( c.hasOwnProperty('s') );
                test.ok(!c.hasOwnProperty('p') );
                test.ok(!c.hasOwnProperty('b') );
                test.equal( Object.getOwnPropertyNames(c).length, 1);
                test.strictEqual(c.p, p.p);
                test.strictEqual(c.s, s.s);            
                test.strictEqual(c.b, b.b);            
               
            test.done();        
        },
        
        create: function(test){
            var c = clone.create({a:1});
                test.ok( c.hasOwnProperty('a') );
                test.equal( Object.getPrototypeOf(c), clone.prototype);
                test.strictEqual( Object.getOwnPropertyNames(c).length, 1);

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
        }

    }
};
