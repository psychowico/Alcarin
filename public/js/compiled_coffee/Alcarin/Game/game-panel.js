'use strict';namespace('Alcarin.Game', function(exports, Alcarin) {
  var module, socket_port;

  socket_port = 8080;
  module = angular.module('game-panel', ['@game-events', '@spin', 'ui.event', 'ngCookies', '@area-map']).config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/home', {
        controller: Alcarin.Game.Views.Home,
        templateUrl: urls.game.panel + '/__home'
      }).otherwise({
        redirectTo: '/home'
      });
    }
  ]);
  exports.App = ngcontroller([
    '$timeout', '$location', '$cookies', function($timeout, $location, cookies) {
      var authorize, reinitalize_socket_connection,
        _this = this;

      this.waiting = false;
      this.initialized = false;
      this.charid = null;
      this.onGameEvent = function(ev) {
        return _this.$safeApply(function() {
          return _this.$broadcast('game-event', ev);
        });
      };
      this.onGameEventReset = function(events) {
        return _this.$safeApply(function() {
          return _this.$broadcast('reset-events', events);
        });
      };
      authorize = function() {
        _this.waiting = true;
        return _this.socket.emit('auth', {
          charid: _this.charid,
          session: cookies.alcarin
        });
      };
      reinitalize_socket_connection = function() {
        var socket;

        if (typeof io !== "undefined" && io !== null) {
          _this.socket = socket = io.connect($location.host() + (":" + socket_port));
          socket.on('reset-events', _this.onGameEventReset);
          socket.on('game-event', _this.onGameEvent);
          socket.on('reconnect', authorize);
          socket.on('authorized', function() {
            return _this.$broadcast('initialized', socket);
          });
          return authorize();
        }
      };
      return this.$watch('charid', function() {
        var host, loading;

        if (_this.charid != null) {
          if (!_this.initialized) {
            host = $location.host();
            loading = Alcarin.Game.loadSocketLibrary(host, socket_port);
            return loading.then(reinitalize_socket_connection);
          } else {
            return reinitalize_socket_connection();
          }
        }
      });
    }
  ]);
  return exports.GameEvents = ngcontroller(function() {
    var reg, translate_event, translate_events,
      _this = this;

    this.events = [];
    this.talkContent = '';
    this.sending = false;
    this.talkToAll = function() {
      var content;

      _this.sending = true;
      content = _this.talkContent;
      _this.talkContent = '';
      return _this.socket.emit('public-talk', content);
    };
    this.onKeyDown = function(event) {
      if (event.keyCode === 13) {
        if (!event.shiftKey) {
          _this.talkToAll();
          return event.preventDefault();
        }
      }
    };
    this.t = function(x) {
      return console.log(x);
    };
    this.$on('reset-events', function(ev, data) {
      _this.waiting = false;
      return _this.events = (function() {
        var _i, _len, _results;

        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          ev = data[_i];
          _results.push(translate_event(ev));
        }
        return _results;
      })();
    });
    this.$on('game-event', function(ev, data) {
      return _this.events.splice(0, 0, translate_event(data));
    });
    reg = /%([0-9])+/g;
    translate_event = function(ev) {
      var arg, arg_index, fArg, match, offset, output, pre_text, _text;

      _text = ev.text;
      output = [];
      offset = 0;
      while (match = reg.exec(_text)) {
        arg_index = parseInt(match[1]);
        arg = ev.args[arg_index];
        if ($.isPlainObject(arg)) {
          fArg = $.extend({
            text: arg.text
          }, arg.__base);
          Alcarin.GameObject.Factory(fArg);
        } else {
          fArg = {
            text: arg,
            type: 'text'
          };
        }
        pre_text = _text.substr(offset, match.index);
        if (pre_text.length > 0) {
          output.push({
            text: pre_text,
            type: 'text'
          });
        }
        output.push(fArg);
        _text = _text.substr(match.index + match[0].length);
      }
      return {
        body: output,
        time: ev.time
      };
    };
    translate_events = function(events_data) {
      var ev, result, _i, _len, _text;

      result = [];
      for (_i = 0, _len = events_data.length; _i < _len; _i++) {
        ev = events_data[_i];
        _text = ev.text || '';
        if (_text.length === 0) {
          continue;
        }
        result.push(translate_event(ev));
      }
      return result;
    };
    return this.charClicked = function(_char) {
      return _char.resolve().then(function(c) {
        return console.log(c);
      });
    };
  });
});

/*
//@ sourceMappingURL=game-panel.js.map
*/
