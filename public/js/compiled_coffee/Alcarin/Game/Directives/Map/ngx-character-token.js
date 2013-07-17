'use strict';namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcCharacterToken', [
    'MapBackground', function(MapBackground) {
      return {
        restrict: 'A',
        scope: {
          alcCharacterToken: '=',
          playerCharacter: '='
        },
        link: function($scope, $token, attrs) {
          var resetPosition;

          resetPosition = function() {
            var loc, _ref;

            loc = (_ref = $scope.alcCharacterToken) != null ? _ref.loc : void 0;
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
          $scope.$watch('alcCharacterToken.loc', resetPosition);
          MapBackground.$on('zoom', resetPosition);
          $scope.$watch('playerCharacter', function(val) {
            var isCurrentChar;

            isCurrentChar = val === $scope.alcCharacterToken._id;
            return $token.toggleClass('current', isCurrentChar);
          });
          return $scope.$watch('alcCharacterToken.name', function(val) {
            return $token.attr('title', val);
          });
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-character-token.js.map
*/
