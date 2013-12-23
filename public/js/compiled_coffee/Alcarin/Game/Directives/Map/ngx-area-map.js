'use strict';
namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
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
              var info, _terrain;
              _terrain = map.zoom ? terrainTile : terrain;
              info = map.info;
              _terrain.setCenter(info.center);
              if (_terrain.setRadius != null) {
                _terrain.setRadius(info.radius);
              }
              _terrain.setFields(info.fields);
              _terrain.setLighting(info.lighting);
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
