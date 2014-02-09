'use strict';
namespace('Alcarin.Game.Views.Map', function(exports, Alcarin) {
  var Place;
  Place = (function() {
    function Place(id, loc) {
      this.id = id;
      this.loc = loc;
    }

    return Place;

  })();
  exports.Place = Place;
  return exports.Places = ngcontroller([
    'MapBackground', function(MapBackground) {
      this.placesList = [];
      return MapBackground.dataReady().then((function(_this) {
        return function(map) {
          var reloadPlaces;
          reloadPlaces = function() {
            var getKey, place, places, plot, plots, table, x, y, _i, _len, _plots, _ref;
            plots = map.info.plots;
            console.log(plots);
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
              places[place] = new Place(place, {
                x: x,
                y: y
              });
            }
            return _this.placesList = places;
          };
          MapBackground.$on('swap', reloadPlaces);
          return reloadPlaces();
        };
      })(this));
    }
  ]);
});

/*
//@ sourceMappingURL=places.js.map
*/
