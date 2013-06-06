'use strict';

var __slice = [].slice;

namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('@core').factory('@EventsBus', function() {
    var EventsBus;
    EventsBus = (function() {
      var listeners;

      function EventsBus() {}

      listeners = {};

      EventsBus.prototype.on = function(name, meth) {
        if (!(listeners[name] != null)) {
          listeners[name] = [];
        }
        return listeners[name].push(meth);
      };

      EventsBus.prototype.emit = function() {
        var args, name, _i, _len, _meth, _ref, _results;
        name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (listeners[name] != null) {
          _ref = listeners[name];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            _meth = _ref[_i];
            _results.push(_meth.apply(window, args));
          }
          return _results;
        }
      };

      return EventsBus;

    })();
    return new EventsBus();
  });
});
