// nodeunit

this.tests = {

    clone: {
        create: function(test){
            var c = clone.create({a:1});
                test.ok( c.hasOwnProperty('a') );
                test.equal( Object.getPrototypeOf(c), clone.prototype);
                test.strictEqual( Object.getOwnPropertyNames(c).length, 1);
            

            test.done();
        },

        __inits__: function(test){
            var obj = clone({
                getterCalls: 0,
                setterCalls: 0
                },{
                __inits__: {
                    getterOnce: function(){
                        this.getterCalls++;
                        return 'G';
                    },
                    setterOnce: function(value){
                        this.setterCalls++;
                        return value;
                    }   
                }
            });

            test.equal(obj.getterOnce, 'G');
            test.equal(obj.getterOnce, 'G');
            test.equal(obj.getterCalls, 1);

            obj.setterOnce = 'S1';
            test.equal(obj.setterOnce, 'S1');
            obj.setterOnce = 'S2';
            test.equal(obj.setterOnce, 'S2');
            test.equal(obj.setterCalls, 1);

            test.done();
        }

    }
};
