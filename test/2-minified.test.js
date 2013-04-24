global.clonejs = require('../build/clone.min.js');
global.$object = clonejs.$object;

module.exports = require('./clone.spec.js');