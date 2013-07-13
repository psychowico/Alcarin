'use strict';namespace('Alcarin.Game', function(exports, Alcarin) {
  var socket_port;

  socket_port = 8080;
  exports.module = angular.module('game', ['@spin', 'ui.event', '@talk-input', '@area-map', '@game-services', '@character-token']).config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/home', {
        controller: Alcarin.Game.Views.Home,
        templateUrl: urls.game.panel + '/__home'
      }).otherwise({
        redirectTo: '/home'
      });
    }
  ]);
  return exports.App = ngcontroller([
    '$window', 'CurrentCharacter', 'GameServer', function($window, CurrentCharacter, GameServer) {
      this.charid = $window.charid;
      GameServer.init(charid);
      return CurrentCharacter.init(charid);
    }
  ]);
});

/*
//@ sourceMappingURL=game-panel.js.map
*/
