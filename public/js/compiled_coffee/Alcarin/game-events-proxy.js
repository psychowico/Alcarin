var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin', function(exports, Alcarin) {
  /*
      Events proxy, others object can register his functions on specific event call
      and react in some way
  */
  exports.GameEventsProxy = (function() {

    function GameEventsProxy() {
      this.register_events = {};
    }

    GameEventsProxy.prototype.on = function(event_name, callback) {
      var _callbacks;
      _callbacks = this.register_events[event_name];
      if (_callbacks === void 0) {
        _callbacks = $.Callbacks();
        this.register_events[event_name] = _callbacks;
      }
      _callbacks.add(callback);
      return this;
    };

    GameEventsProxy.prototype.off = function(event_name, callback) {
      var _callbacks;
      _callbacks = this.register_events[event_name];
      if (_callbacks === void 0) {
        return this;
      }
      _callbacks.remove(callback);
      return this;
    };

    GameEventsProxy.prototype._onStateChanged = function(state) {
      var _callbacks, _event, _eventid, _ref;
      _ref = state.events;
      for (_eventid in _ref) {
        _event = _ref[_eventid];
        _callbacks = this.register_events[_event.id];
        if (_callbacks) {
          _callbacks.fire(_event.data);
        }
      }
      return this;
    };

    GameEventsProxy.prototype.stateChangeMock = function(changes_object) {
      return this._onStateChanged(changes_object);
    };

    return GameEventsProxy;

  })();
  exports.Test1 = (function() {

    function Test1(proxy, val) {
      this.onTest = __bind(this.onTest, this);
      this.japko = val;
      proxy.on('test.test', this.onTest);
    }

    Test1.prototype.onTest = function(data) {};

    return Test1;

  })();
  return $(function() {
    var proxy, test;
    proxy = new Alcarin.GameEventsProxy();
    test = new Alcarin.Test1(proxy, 13);
    test = new Alcarin.Test1(proxy, 7);
    return proxy.stateChangeMock({
      'events': [
        {
          'id': 'test.test',
          'data': 'and what?'
        }
      ]
    });
  });
});
