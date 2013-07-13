'use strict';namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('@character-token').directive('alcCharacterToken', function() {
    return {
      restrict: 'A',
      scope: {
        alcCharacterToken: '=',
        playerCharacter: '='
      },
      link: function($scope, element, attrs) {
        $scope.$watch('alcCharacterToken.pixelLoc', function(loc) {
          if (loc) {
            return element.position({
              top: loc.y,
              left: loc.x
            });
          }
        });
        return $scope.$watch('playerCharacter', function(val) {
          if (val === $scope.alcCharacterToken._id) {
            return element.addClass('current');
          } else {
            return element.removeClass('current');
          }
        });
      }
    };
  });
});

/*
//@ sourceMappingURL=ngx-character-token.js.map
*/
