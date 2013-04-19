global.clonejs = require('../src/clone.js').inject();
global.$object = clonejs.$object;

module.exports = require('./clone.spec.js');