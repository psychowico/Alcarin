'use strict';
namespace('Alcarin.Game.Views', function(exports, Alcarin) {
  return exports.Home = ngcontroller([
    'GameServer', function(GameServer) {
      this.mainDescription = '';
      return GameServer.on('descriptions.swap', (function(_this) {
        return function(descr) {
          return _this.mainDescription = descr;
        };
      })(this));
    }
  ]);
});

/*
//@ sourceMappingURL=home.js.map
*/
