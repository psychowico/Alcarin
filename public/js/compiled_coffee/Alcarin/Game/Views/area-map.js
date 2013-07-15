'use strict';namespace('Alcarin.Game.Views', function(exports, Alcarin) {
  return exports.AreaMap = ngcontroller([
    'GameServer', 'CurrentCharacter', '$q', '$safeApply', 'MapBackground', function(GameServer, CurrentCharacter, $q, $safeApply, MapBackground) {
      var _this = this;

      this.redrawMap = function() {
        return $safeApply(_this, function() {
          MapBackground.reset();
          return GameServer.emit('swap.all');
        });
      };
      GameServer.on('terrain.swap', function(terrain, info) {
        return CurrentCharacter.then(function(character) {
          MapBackground.init(character.loc, info);
          return MapBackground.setFields(terrain);
        });
      });
      return MapBackground.setPixelRadius($('.area-map canvas.terrain').width() / 2);
    }
  ]);
});

/*
//@ sourceMappingURL=area-map.js.map
*/
