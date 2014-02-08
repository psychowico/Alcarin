'use strict';
namespace('Alcarin.Game.Views.Map', function(exports, Alcarin) {
  return exports.Places = ngcontroller([
    'MapBackground', function(MapBackground) {
      var _this = this;
      this.placesList = [];
      return MapBackground.dataReady().then(function(map) {
        var getKey, place, places, plot, plots, table, x, y, _i, _len, _plots, _ref;
        plots = map.info.plots;
        table = {};
        getKey = function(loc) {
          return Math.floor(loc.x) + ';' + Math.floor(loc.y);
        };
        places = {};
        _ref = plots.data;
        for (place in _ref) {
          _plots = _ref[place];
          x = 0;
          y = 0;
          for (_i = 0, _len = _plots.length; _i < _len; _i++) {
            plot = _plots[_i];
            x += plot.loc.x;
            y += plot.loc.y;
          }
          x /= _plots.length;
          y /= _plots.length;
          places[place] = {
            loc: {
              x: x,
              y: y
            }
          };
        }
        return _this.placesList = places;
      });
    }
  ]);
});

/*
//@ sourceMappingURL=places.js.map
*/
