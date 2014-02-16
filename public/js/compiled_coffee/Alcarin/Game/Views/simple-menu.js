'use strict';
namespace('Alcarin.Game.Views', function(exports, Alcarin) {
  return exports.SimpleMenu = ngcontroller([
    'MapBackground', 'CurrentCharacter', 'GameServer', function(MapBackground, CurrentChar, GameServer) {
      this.playerOnPlot = false;
      this.togglePlace = (function(_this) {
        return function() {
          if (_this.playerOnPlot && !_this.toggleOutside()) {
            return GameServer.emit('enter-place', _this.playerOnPlot);
          }
        };
      })(this);
      this._checkVisibility = (function(_this) {
        return function(map) {
          return CurrentChar.then(function(current) {
            var key, plots;
            plots = MapBackground.info.plots;
            key = plots.getKey(current.loc);
            return _this.playerOnPlot = plots.dict[key];
          });
        };
      })(this);
      MapBackground.$on('swap', this._checkVisibility);
      return MapBackground.dataReady().then(this._checkVisibility);
    }
  ]);
});

/*
//@ sourceMappingURL=simple-menu.js.map
*/
