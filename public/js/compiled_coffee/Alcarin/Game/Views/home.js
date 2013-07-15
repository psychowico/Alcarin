'use strict';namespace('Alcarin.Game.Views', function(exports, Alcarin) {
  return exports.Home = ngcontroller([
    'GameServer', function(GameServer) {
      var _this = this;

      this.mainDescription = '';
      return GameServer.on('descriptions.swap', function(descr) {
        return _this.mainDescription = descr;
      });
    }
  ]);
});

/*
//@ sourceMappingURL=home.js.map
*/
