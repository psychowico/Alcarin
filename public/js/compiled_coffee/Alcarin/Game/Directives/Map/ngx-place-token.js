'use strict';
namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcPlaceToken', [
    'MapBackground', function(MapBackground) {
      return {
        scope: {
          alcPlaceToken: '='
        },
        link: function($scope, $token, attrs) {
          var setPosition;
          setPosition = function() {
            var loc, _ref;
            loc = (_ref = $scope.alcPlaceToken) != null ? _ref.loc : void 0;
            if (loc == null) {
              return;
            }
            return MapBackground.dataReady().then(function(map) {
              var ploc;
              ploc = map.units().toPixels(loc.x, loc.y);
              $token.position({
                top: ploc.y,
                left: ploc.x
              });
              return $token.show();
            });
          };
          return $scope.$watch('alcPlaceToken.loc', setPosition);
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-place-token.js.map
*/
