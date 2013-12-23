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
    '$window', 'CurrentCharacter', 'GameServer', 'MapBackground', function($window, CurrentCharacter, GameServer, MapBackground) {
      this.charid = $window.charid;
      GameServer.init(charid);
      return CurrentCharacter.init(charid);
    }
  ]);
});

/*
//@ sourceMappingURL=game-panel.js.map
*/
