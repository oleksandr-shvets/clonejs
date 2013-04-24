global.clonejs = require('../src/clone.js').inject(Object.prototype);
global.$object = Object.prototype;//clonejs.$object;

module.exports = require('./clone.spec.js');