function runNodeUnit(tests, groupName){
    var NewTestCase = TestCase(groupName||'clone.js');

    for(var name in tests){
        var test = tests[name];
        if(typeof test == 'function'){
            NewTestCase.prototype['test ' + name] = test.bind(tests, runNodeUnit.testArg);

        }else if(typeof test == 'object'){
            runNodeUnit(test, groupName ? groupName +'.'+ name : name);
        }
    }
}

runNodeUnit.testArg = {
    ok: function(actual, msg){
        assertTrue(msg, actual);
    },
    equal: function(actual, expected, msg){
        assertEquals(msg, expected, actual);
    },
    strictEqual: function(actual, expected, msg){
        assertSame(msg, expected, actual);
    },
    deepEqual: function(actual, expected, msg){
        assertEquals(msg, expected.length, actual.length);
        //TODO:
    },
    expect: function(){},
    done: function(){}
}

function require(fileName){}
console = jstestdriver.console;

runNodeUnit( this['clone.js'] );