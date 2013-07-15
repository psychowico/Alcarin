'use strict';namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return angular.module('@world-center').directive('alcRangeLimits', [
    'MapBackground', function(MapBackground) {
      return {
        restrict: 'A',
        link: function($scope, $shadow, attrs) {
          return MapBackground.$on('drawn', function(units) {
            var $child, pos, shadowRadius;

            pos = units.center();
            $shadow.position({
              left: pos.x,
              top: pos.y
            });
            shadowRadius = MapBackground.charViewRadius * MapBackground.pixelRadius / MapBackground.radius;
            $child = $shadow.children();
            $child.width(2 * shadowRadius);
            $child.height(2 * shadowRadius);
            return $child.position({
              left: -shadowRadius,
              top: -shadowRadius
            });
          });
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-world-center.js.map
*/
