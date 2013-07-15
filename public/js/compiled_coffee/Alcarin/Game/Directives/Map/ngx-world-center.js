'use strict';namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcWorldCenter', [
    'MapBackground', function(MapBackground) {
      return {
        restrict: 'A',
        link: function($scope, $icon, attrs) {
          return MapBackground.$on('drawn', function(units) {
            var c, length, nvector, pc, pradius;

            c = units.center();
            length = Math.sqrt(c.x * c.x + c.y * c.y);
            nvector = {
              x: -c.x / length,
              y: -c.y / length
            };
            pradius = units.pixelRadius();
            pc = units.pixelCenter();
            $icon.position({
              left: pc.x + nvector.x * pradius,
              top: pc.y + nvector.y * pradius
            });
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
