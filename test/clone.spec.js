// nodeunit

this.tests = {

    clone: {
        "2 args": function(test){
            //TODO: 2 args test
            test.done();        
        },
        "3 args": function(test){
            //TODO: 3 args test
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
