'use strict';
var __slice = [].slice;

namespace('Alcarin', function(exports, Alcarin) {
  return exports.EventsEmitter = (function() {
    function EventsEmitter() {}

    EventsEmitter.prototype.$on = function(name, meth) {
      if (meth == null) {
        throw Error("Can not react on undefined event. Event name: " + name);
      }
      this.$_listeners = this.$_listeners || {};
      if (this.$_listeners[name] == null) {
        this.$_listeners[name] = [];
      }
      return this.$_listeners[name].push(meth);
    };

    EventsEmitter.prototype.$emit = function() {
      var args, name, _i, _j, _len, _len1, _meth, _ref, _ref1, _results;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.$_listeners = this.$_listeners || {};
      if (this.$_listeners[name] != null) {
        _ref = this.$_listeners[name];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _meth = _ref[_i];
          _meth.apply(this, args);
        }
      }
      if (this.$_listeners['*'] != null) {
        _ref1 = this.$_listeners['*'];
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          _meth = _ref1[_j];
          _results.push(_meth.call(this, {
            name: name,
            args: args
          }));
        }
        return _results;
      }
    };

    return EventsEmitter;

  })();
});

/*
//@ sourceMappingURL=events-emitter.js.map
*/
