'use strict';namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcMoveTarget', [
    'CurrentCharacter', 'MapBackground', function(CurrentCharacter, MapBackground) {
      return {
        restrict: 'A',
        link: function($scope, $token, attrs) {
          var updateTarget;

          updateTarget = function() {
            return MapBackground.dataReady().then(function(map) {
              return CurrentCharacter.then(function(character) {
                var loc, target, visible, _ref;

                visible = ((_ref = character.move) != null ? _ref.target : void 0) != null;
                if (visible) {
                  target = character.move.target;
                  loc = map.units().toPixels(target.x, target.y);
                  $token.position({
                    left: loc.x,
                    top: loc.y
                  });
                }
                return $token.toggle(visible);
              });
            });
          };
          CurrentCharacter.then(function(character) {
            return character.$on('update', updateTarget);
          });
          return updateTarget();
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-move-target.js.map
*/
