'use strict';namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcWorldCenter', [
    'MapBackground', function(MapBackground) {
      return {
        restrict: 'A',
        link: function($scope, $icon, attrs) {
          return MapBackground.dataReady().then(function(map) {
            var c, length, newPos, nvector, pc, pradius;

            c = map.units().center();
            length = Math.sqrt(c.x * c.x + c.y * c.y);
            nvector = {
              x: -c.x / length,
              y: -c.y / length
            };
            pradius = map.units().pixelRadius();
            pc = map.units().pixelCenter();
            newPos = {
              left: pc.x + nvector.x * pradius,
              top: pc.y + nvector.y * pradius
            };
            $icon.position(newPos);
            return $icon.show();
          });
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-world-center.js.map
*/
