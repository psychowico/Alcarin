'use strict';
var ServerConnector, socket_port,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

socket_port = 8080;

ServerConnector = (function() {
  function ServerConnector(host, port, sessionid, $scope) {
    this.host = host;
    this.port = port;
    this.sessionid = sessionid;
    this.$scope = $scope;
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
      return _this.emit('swap.all');
    });
  };

  ServerConnector.prototype.init = function(charid) {
    this.charid = charid;
    return this.initSocket.then(this.socketInitialized);
  };

  ServerConnector.prototype.on = function(eventId, callback) {
    var safeCallback, scope;

    scope = this.$scope;
    safeCallback = function() {
      var args;

      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return scope.$safeApply(function() {
        return callback.apply(this, args);
      });
    };
    this.initSocket.then(function(socket) {
      return socket.on(eventId, safeCallback);
    });
    return this;
  };

  ServerConnector.prototype.emit = function(eventId, _args) {
    Q.all(this.initSocket, this.authorization).then(function(socket) {
      return socket.emit.apply(socket, [eventId].concat(_args));
    });
    return this;
  };

  ServerConnector.prototype.socketInitialized = function(socket) {
    var _this = this;

    socket.on('connect', this.authorize);
    socket.on('disconnect', function() {
      console.warn('GameServer disconnected.');
      return _this.resetAuth();
    });
    return socket.on('authorized', function() {
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

angular.module('@game-server', ['ngCookies']).factory('GameServer', [
  '$location', '$cookies', '$rootScope', function($location, cookies, $rootScope) {
    var service;

    console.info('creating server service..');
    service = new ServerConnector($location.host(), socket_port, cookies.alcarin, $rootScope);
    return service;
  }
]);

/*
//@ sourceMappingURL=ngx-server-io.js.map
*/
