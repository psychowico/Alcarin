'use strict';
namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcMapTracker', [
    'MapBackground', '$q', function(MapBackground, $q) {
      return {
        restrict: 'A',
        scope: {
          alcMapTracker: '=',
          alcOnPositionChange: '&'
        },
        link: function($scope, $token, attrs) {
          return MapBackground.dataReady().then(function(map) {
            var setPosition;
            setPosition = function() {
              var loc, ploc, target;
              target = $scope.alcMapTracker;
              $token.data('rel', target);
              loc = target != null ? target.loc : void 0;
              if (loc == null) {
                console.warn("Not found 'loc' property in " + target);
              }
              if (loc == null) {
                return;
              }
              ploc = map.units().toPixels(loc.x, loc.y);
              $token.position({
                top: ploc.y,
                left: ploc.x
              });
              if (typeof $scope.alcOnPositionChange === "function") {
                $scope.alcOnPositionChange();
              }
              return $token.show();
            };
            $scope.$watch('alcMapTracker.loc', setPosition);
            MapBackground.$on('swap', setPosition);
            return MapBackground.$on('zoom', setPosition);
          });
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-map-tracker.js.map
*/
