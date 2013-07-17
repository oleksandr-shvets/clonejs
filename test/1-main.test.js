global.clone = require('../src/clone.js');
var    tests = require('./clone.spec.js').tests;

module.exports = {
    get byProto()      {clone.by('proto');       return tests},
    get byCreate()     {clone.by('create');      return tests},
    get byConstructor(){clone.by('constructor'); return tests}
};
//module.exports = tests;