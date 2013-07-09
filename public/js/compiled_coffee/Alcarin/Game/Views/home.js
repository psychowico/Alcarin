'use strict';namespace('Alcarin.Game.Views', function(exports, Alcarin) {
  return exports.Home = ngcontroller([
    'GameServer', function(GameServer) {
      return GameServer.on('terrain.swap', function(data) {
        return console.log(data);
      });
    }
  ]);
});

/*
//@ sourceMappingURL=home.js.map
*/
