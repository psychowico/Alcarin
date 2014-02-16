'use strict';
namespace('Alcarin.Game', function(exports, Alcarin) {
  var AppBody, socket_port;
  socket_port = 8080;
  exports.module = angular.module('game', ['@spin', 'ui.event', '@talk-input', '@game-services', '@alcarin-map', '@popover', 'ngRoute']).config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/home', {
        controller: Alcarin.Game.Views.Home,
        templateUrl: urls.game.panel + '/__home'
      }).when('/chars', {
        controller: Alcarin.Game.Views.Chars,
        templateUrl: urls.game.panel + '/__chars'
      }).when('/place-default', {
        controller: Alcarin.Game.Views.Place.Default,
        templateUrl: urls.game.panel + '/__place-default'
      }).otherwise({
        redirectTo: '/home'
      });
    }
  ]);
  AppBody = function($window, $safeApply, CurrentCharacter, GameServer, MapBackground, $location) {
    this.charid = $window.charid;
    this["interface"] = null;
    this.outside = true;
    GameServer.init(charid);
    CurrentCharacter.init(charid);
    this.$watch('outside', (function(_this) {
      return function() {
        return _this.updateInterface();
      };
    })(this));
    this.toggleOutside = (function(_this) {
      return function() {
        return _this.outside = !_this.outside;
      };
    })(this);
    this.updateInterface = (function(_this) {
      return function() {
        var I, _interface;
        I = Alcarin.Game.Interfaces;
        _interface = I.Default;
        if (!_this.outside) {
          _interface = I.Place;
        }
        if (_this["interface"] !== _interface) {
          $location.path(_interface.mainbar[0].href);
          return _this["interface"] = _interface;
        }
      };
    })(this);
    CurrentCharacter.then((function(_this) {
      return function(current) {
        return _this.outside = current.loc.place == null;
      };
    })(this));
    return this.updateInterface();
  };
  return exports.App = ngcontroller(['$window', '$safeApply', 'CurrentCharacter', 'GameServer', 'MapBackground', '$location', AppBody]);
});

/*
//@ sourceMappingURL=game.js.map
*/
