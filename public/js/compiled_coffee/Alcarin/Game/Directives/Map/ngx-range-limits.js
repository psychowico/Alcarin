'use strict';namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcRangeLimits', [
    'MapBackground', function(MapBackground) {
      return {
        restrict: 'A',
        link: function($scope, $shadow, attrs) {
          return MapBackground.dataReady().then(function(map) {
            var $child, pos, shadowRadius;

            pos = map.units().pixelCenter();
            $shadow.position({
              left: pos.x,
              top: pos.y
            });
            shadowRadius = map.charViewRadius * map.pixelRadius / map.radius;
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
//@ sourceMappingURL=ngx-range-limits.js.map
*/
