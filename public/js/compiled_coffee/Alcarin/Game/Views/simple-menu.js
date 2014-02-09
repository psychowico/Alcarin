'use strict';
namespace('Alcarin.Game.Views', function(exports, Alcarin) {
  return exports.SimpleMenu = ngcontroller([
    'MapBackground', 'CurrentCharacter', function(MapBackground, CurrentChar) {
      this.playerOnPlot = false;
      return MapBackground.$on('swap', (function(_this) {
        return function(map) {
          return CurrentChar.then(function(current) {
            var key, plots;
            plots = MapBackground.info.plots;
            key = plots.getKey(current.loc);
            return _this.playerOnPlot = plots.dict[key];
          });
        };
      })(this));
    }
  ]);
});

/*
//@ sourceMappingURL=simple-menu.js.map
*/
