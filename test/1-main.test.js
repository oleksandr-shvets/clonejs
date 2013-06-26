global._ = require('../src/clone.js');

module.exports = require('./clone.spec.js');

//var $object = require('clonejs')();
//require('clonejs')(Object.prototype);
//
//
//var $object = require('clonejs');
//require('clonejs').paste(Object.prototype);
//
//
//var $object = require('clonejs').$object;
//require('clonejs').paste(Object.prototype);
//
//
//Object$.prototype
//
//var $object = require('clonejs').prototype;
//require('clonejs').prototype.paste(Object.prototype);
//require('clonejs')(Object.prototype);
//
//var $ = require('clonejs');
//$.prototype.paste(Object.prototype);
//$($).paste(Object.prototype);
//$($.prototype, 'paste')(Object.prototype);
//
//
//$(this, 'paste',[Object.prototype]);
//$(this, 'paste')(Object.prototype);
//
//$(arguments, 'slice', [1], Array);
//
//// Object literal: $({})        == $object.clone({})
////       Function: $(Array)    === Array.prototype
////   Other object: $(new Array) == $object.paste(new Array)
// Clone({})        == new Clone({})         == object.clone({})
// Clone(new Array) == new Clone(new Array)  == 
// Clone(23)        == new Clone(23)         == Object(23)
// Clone(Array)     !=
// Clone(this, 'getPrototypes') !=

//var $object = require('clonejs').inject(Object.prototype);
