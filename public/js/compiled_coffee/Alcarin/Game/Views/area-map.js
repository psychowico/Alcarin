'use strict';namespace('Alcarin.Game.Views', function(exports, Alcarin) {
  return exports.AreaMap = ngcontroller([
    'GameServer', 'CurrentCharacter', '$q', '$safeApply', 'MapBackground', function(GameServer, CurrentCharacter, $q, $safeApply, MapBackground) {
      var lastClick,
        _this = this;

      this.showGreatTower = true;
      this.showMoveTarget = true;
      this.showChars = true;
      this.showEyeRange = true;
      this.redrawMap = function() {
        return $safeApply(_this, function() {
          MapBackground.reset();
          return GameServer.emit('swap.all');
        });
      };
      lastClick = new Date();
      this.mapClicked = function(ev) {
        var current, diff;

        current = new Date();
        diff = (current.getTime() - lastClick.getTime()) / 1000;
        if (diff > 1) {
          if (MapBackground.isReady) {
            MapBackground.then(function(units) {
              var target;

              target = units.toUnits(ev.offsetX, ev.offsetY);
              return CurrentCharacter.then(function(character) {
                return character.moveTo(target);
              });
            });
          }
          return lastClick = current;
        }
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
