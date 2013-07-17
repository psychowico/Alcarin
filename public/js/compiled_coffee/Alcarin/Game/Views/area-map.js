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
      this.toggleZoomMap = function() {
        _this.zoomMap = !_this.zoomMap;
        return MapBackground.enableZoom(_this.zoomMap);
      };
      lastClick = new Date();
      this.mapClicked = function(ev) {
        var current, diff;

        current = new Date();
        diff = (current.getTime() - lastClick.getTime()) / 1000;
        if (diff > 1) {
          MapBackground.dataReady().then(function(map) {
            var target;

            target = map.units().toUnits(ev.offsetX, ev.offsetY);
            return CurrentCharacter.then(function(character) {
              return character.moveTo(target);
            });
          });
          return lastClick = current;
        }
      };
      return MapBackground.setPixelRadius($('.area-map canvas.terrain').width() / 2);
    }
  ]);
});

/*
//@ sourceMappingURL=area-map.js.map
*/
