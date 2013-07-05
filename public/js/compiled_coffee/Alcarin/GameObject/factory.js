'use strict';
/*
We need getting all GameObject from this factory. This provides us that this same
GameObject will be related with this same GameObject instance.
To use it, first you need register GameObject factory type (one time, when adding new
GameObject) type to system.
Alcarin.GameObject.Factory.register can_resolve, resolving
Where "can_resolve" is method, that will be called with base object and return true/false
if you factory can resolve this object. Registered factory should take care about
caching they results.

Next, when we have base object, we call Alcarin.GameObject.Factory(arg) method for it.
From now, "arg" will have "resolve()" method that return GameObject promise (Q promise).
It is because we want lazy resolving game objects.

Alcarin.GameObject.Factory(char)
char.resolve().then (charGameObject)->
    console.log charGameObject.name
*/
namespace('Alcarin.GameObject', function(exports, Alcarin) {
  var factories, resolvingGameObject;

  factories = [];
  resolvingGameObject = function(resolving_method, obj) {
    return function() {
      return Q(resolving_method(obj));
    };
  };
  exports.Factory = function(arg) {
    var factory, _i, _len,
      _this = this;

    for (_i = 0, _len = factories.length; _i < _len; _i++) {
      factory = factories[_i];
      if (factory.condition(arg)) {
        (function(factory, arg) {
          return arg.resolve = resolvingGameObject(factory.resolving, arg);
        })(factory, arg);
        return arg;
      }
    }
    throw Error('Can not resolve object: ' + JSON.stringify(arg));
  };
  return exports.Factory.register = function(can_resolve, resolving_method) {
    return factories.push({
      condition: can_resolve,
      resolving: resolving_method
    });
  };
});

/*
//@ sourceMappingURL=factory.js.map
*/
