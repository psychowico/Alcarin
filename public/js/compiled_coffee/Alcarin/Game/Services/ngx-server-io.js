'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

namespace('Alcarin.Game.Services', function(exports, Alcarin) {
  var ServerConnector, socket_port;
  exports.module = angular.module('@game-services', ['ngCookies']).factory('GameServer', [
    '$location', '$cookies', '$rootScope', '$q', function($location, cookies, $rootScope, $q) {
      var service;
      console.info('creating server service..');
      service = new ServerConnector($location.host(), socket_port, cookies.alcarin, $rootScope, $q);
      return service;
    }
  ]);
  socket_port = 8080;
  return ServerConnector = (function() {
    function ServerConnector(host, port, sessionid, $scope, $q) {
      this.host = host;
      this.port = port;
      this.sessionid = sessionid;
      this.$scope = $scope;
      this.$q = $q;
      this.authorize = __bind(this.authorize, this);
      this.socketInitialized = __bind(this.socketInitialized, this);
      this.resetAuth = __bind(this.resetAuth, this);
      this.initSocket = this._loadSocketLibrary(this.host, this.port);
      this.resetAuth();
    }

    ServerConnector.prototype.resetAuth = function() {
      var _this = this;
      this.authorizationToken = Q.defer();
      this.authorization = this.authorizationToken.promise;
      return this.authorization.then(function() {
        console.log('authorized..');
        return _this.emit('swap.all');
      });
    };

    ServerConnector.prototype.init = function(charid) {
      this.charid = charid;
      return this.initSocket.then(this.socketInitialized);
    };

    ServerConnector.prototype.on = function(eventId, callback) {
      var safeCallback, scope;
      if (callback == null) {
        throw Error("Can not react on undefined event. Event name: " + eventId);
      }
      scope = this.$scope;
      safeCallback = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return scope.$safeApply(function() {
          return callback.apply(this, args);
        });
      };
      this.initSocket.done(function(socket) {
        return socket.on(eventId, safeCallback);
      });
      return this;
    };

    ServerConnector.prototype.one = function(eventId) {
      var deffered, scope;
      scope = this.$scope;
      deffered = this.$q.defer();
      this.initSocket.done(function(socket) {
        var callback;
        callback = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          socket.of(callback);
          return scope.$safeApply(function() {
            return deffered.resolve(args);
          });
        };
        return socket.on(eventId, callback);
      });
      return deffered.promise;
    };

    ServerConnector.prototype.emit = function() {
      var emitting, eventId, _args;
      eventId = arguments[0], _args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      emitting = Q.all([this.initSocket, this.authorization]).spread(function(socket) {
        return socket.emit.apply(socket, [eventId].concat(__slice.call(_args)));
      });
      emitting.done();
      return this;
    };

    ServerConnector.prototype.socketInitialized = function(socket) {
      var _this = this;
      socket.on('connect', this.authorize);
      socket.on('disconnect', function() {
        console.warn('GameServer disconnected.');
        return _this.resetAuth();
      });
      return socket.on('client.authorized', function() {
        return _this.authorizationToken.resolve();
      });
    };

    ServerConnector.prototype.authorize = function() {
      var _this = this;
      return this.initSocket.then(function(socket) {
        return socket.emit('auth', {
          charid: _this.charid,
          session: _this.sessionid
        });
      });
    };

    ServerConnector.prototype._loadSocketLibrary = function(host, socket_port) {
      var deffered, intId, loadScript, loaded, port, url;
      deffered = Q.defer();
      loaded = false;
      host = this.host;
      port = this.port;
      url = "http://" + host + ":" + port + "/socket.io/socket.io.js";
      loadScript = function(intId) {
        return $.getScript(url, function() {
          var socket;
          window.clearInterval(intId);
          socket = io.connect("" + host + ":" + port);
          return deffered.resolve(socket);
        });
      };
      intId = window.setInterval((function() {
        return loadScript(intId);
      }), 5000);
      loadScript(intId);
      return deffered.promise;
    };

    return ServerConnector;

  })();
});

/*
//@ sourceMappingURL=ngx-server-io.js.map
*/
