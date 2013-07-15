'use strict';namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcCharacterToken', function() {
    return {
      restrict: 'A',
      scope: {
        alcCharacterToken: '=',
        playerCharacter: '='
      },
      link: function($scope, $token, attrs) {
        $scope.$watch('alcCharacterToken.pixelLoc', function(loc) {
          if (loc) {
            return $token.position({
              top: loc.y,
              left: loc.x
            });
          }
        });
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
  });
});

/*
//@ sourceMappingURL=ngx-character-token.js.map
*/
