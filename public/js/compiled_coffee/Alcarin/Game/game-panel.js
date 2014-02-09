'use strict';
namespace('Alcarin.Game', function(exports, Alcarin) {
  var socket_port;
  socket_port = 8080;
  exports.module = angular.module('game', ['@spin', 'ui.event', '@talk-input', '@game-services', '@alcarin-map', '@popover', 'ngRoute']).config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/home', {
        controller: Alcarin.Game.Views.Home,
        templateUrl: urls.game.panel + '/__home'
      }).when('/chars', {
        controller: Alcarin.Game.Views.Chars,
        templateUrl: urls.game.panel + '/__chars'
      }).otherwise({
        redirectTo: '/home'
      });
    }
  ]);
  return exports.App = ngcontroller([
    '$window', '$safeApply', 'CurrentCharacter', 'GameServer', 'MapBackground', function($window, $safeApply, CurrentCharacter, GameServer, MapBackground) {
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
          return _this["interface"] = _interface;
        };
      })(this);
      return CurrentCharacter.then((function(_this) {
        return function(current) {
          _this.outside = current.loc.place == null;
          return _this.updateInterface();
        };
      })(this));
    }
  ]);
});

/*
//@ sourceMappingURL=game-panel.js.map
*/
