function require(fileName){}
console = jstestdriver.console;



function runNodeUnit(tests, groupName){
    
    console.log(111, groupName);

    var $newTestCase = {};

    for(var name in tests){
        var test = tests[name];
        if(typeof test == 'function'){
            $newTestCase['test ' + name] = test.bind(tests, runNodeUnit.testArg);

        }else if(typeof test == 'object'){
            runNodeUnit(test, groupName ? groupName+'.'+name : name);
        }
    }

    if($newTestCase.length){
        var NewTestCase = TestCase(groupName);
        NewTestCase.prototype = $newTestCase;
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



//runNodeUnit({
//    'test $object': this['test $object'],
//    'test ns': this['test ns']
//},'t');

runNodeUnit(this['test $object'], 'test');