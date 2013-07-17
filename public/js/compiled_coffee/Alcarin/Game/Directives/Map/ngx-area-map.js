'use strict';namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcAreaMap', [
    'MapBackground', function(MapBackground) {
      return {
        restrict: 'A',
        link: function($scope, element, attrs) {
          var Painters, redrawAll, terrain, terrainTile;

          Painters = Alcarin.Game.Directives.Map.Painters;
          terrain = new Painters.Terrain(element);
          terrainTile = new Painters.TerrainTile(element);
          redrawAll = function() {
            return MapBackground.dataReady().then(function(map) {
              var _terrain;

              _terrain = map.zoom ? terrainTile : terrain;
              _terrain.setCenter(map.center);
              if (_terrain.setRadius != null) {
                _terrain.setRadius(map.radius);
              }
              _terrain.setFields(map.fields);
              _terrain.setLighting(map.lighting);
              return _terrain.redraw();
            });
          };
          element.data('rel', [terrain, terrainTile]);
          MapBackground.$on('reset', redrawAll);
          MapBackground.$on('zoom', redrawAll);
          return redrawAll();
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-area-map.js.map
*/
