var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin', function(exports, Alcarin) {
  /*
      Events proxy, others object can register his functions on specific event call
      and react in some way by use on/off methods. call emmit() to emit own events
      to server.
  */
  return exports.EventProxy = (function() {

    function EventProxy(url) {
      this.url = url;
      this._onStateChanged = __bind(this._onStateChanged, this);

      this.register_events = {};
    }

    EventProxy.prototype.on = function(event_name, callback) {
      var _callbacks;
      _callbacks = this.register_events[event_name];
      if (_callbacks === void 0) {
        _callbacks = $.Callbacks();
        this.register_events[event_name] = _callbacks;
      }
      _callbacks.add(callback);
      return this;
    };

    EventProxy.prototype.off = function(event_name, callback) {
      var _callbacks;
      _callbacks = this.register_events[event_name];
      if (_callbacks === void 0) {
        return this;
      }
      _callbacks.remove(callback);
      return this;
    };

    EventProxy.prototype.emit = function(event_name, data) {
      if (data == null) {
        data = {};
      }
      data['__id'] = event_name;
      return Rest().$create(this.url, data, this._onStateChanged);
    };

    EventProxy.prototype._onStateChanged = function(state) {
      var _callbacks, _event, _i, _len, _ref, _ref1;
      console.log(state);
      if (!(state._events != null)) {
        state = {
          _events: [state]
        };
      }
      _ref = state._events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _event = _ref[_i];
        _callbacks = this.register_events[_event.id];
        if (!((_ref1 = _event.data) != null ? _ref1.success : void 0)) {
          console.error("Fail response: '" + _event.id + "',", _event.data);
        }
        if (_callbacks != null) {
          _callbacks.fire(_event.data);
        }
      }
      return true;
    };

    EventProxy.prototype.stateChangeMock = function(changes_object) {
      return this._onStateChanged(changes_object);
    };

    return EventProxy;

  })();
});
