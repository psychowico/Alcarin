'use strict';
namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcCharacterToken', [
    'MapBackground', 'CurrentCharacter', '$q', function(MapBackground, CurrentChar, $q) {
      return {
        restrict: 'A',
        scope: {
          alcCharacterToken: '=',
          playerCharacter: '='
        },
        link: function($scope, $token, attrs) {
          return MapBackground.dataReady().then(function(map) {
            var resetPosition, resetTitle;
            resetTitle = function() {
              var loc, text;
              loc = $scope.alcCharacterToken.loc;
              text = $scope.alcCharacterToken.name;
              return CurrentChar.then(function(current) {
                var cloc, distance, hearable, _end;
                cloc = current.loc;
                distance = Math.sqrt(Math.pow(cloc.x - loc.x, 2) + Math.pow(cloc.y - loc.y, 2));
                hearable = distance <= map.info.talkRadius;
                distance /= 10;
                if (distance < 1) {
                  distance = Math.round(distance * 1000);
                  _end = 'm';
                } else {
                  distance = Math.round(distance);
                  _end = 'km';
                }
                if (distance > 0) {
                  text += "\n" + distance + _end;
                }
                $token.attr('title', text);
                return $token.toggleClass('hearable', hearable);
              });
            };
            resetPosition = function() {
              var loc, ploc, _ref;
              $token.data('rel', $scope.alcCharacterToken);
              loc = (_ref = $scope.alcCharacterToken) != null ? _ref.loc : void 0;
              if (loc == null) {
                return;
              }
              ploc = map.units().toPixels(loc.x, loc.y);
              $token.position({
                top: ploc.y,
                left: ploc.x
              });
              resetTitle();
              return $token.show();
            };
            $scope.$watch('alcCharacterToken.loc', resetPosition);
            MapBackground.$on('swap', resetPosition);
            $scope.$watch('playerCharacter', function(val) {
              var isCurrentChar;
              isCurrentChar = val === $scope.alcCharacterToken._id;
              return $token.toggleClass('current', isCurrentChar);
            });
            return $scope.$watch('alcCharacterToken.name', resetTitle);
          });
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-character-token.js.map
*/
