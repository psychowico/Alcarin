'use strict';namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return angular.module('@move-target').directive('alcMoveTarget', [
    'CurrentCharacter', 'MapBackground', function(CurrentCharacter, MapBackground) {
      return {
        restrict: 'A',
        link: function($scope, $token, attrs) {
          return MapBackground.then(function(units) {
            var updateTarget;

            updateTarget = function() {
              return CurrentCharacter.then(function(character) {
                var loc, target, visible, _ref;

                visible = ((_ref = character.move) != null ? _ref.target : void 0) != null;
                if (visible) {
                  target = character.move.target;
                  loc = units.toPixels(target.x, target.y);
                  $token.position({
                    left: loc.x,
                    top: loc.y
                  });
                }
                return $token.toggle(visible);
              });
            };
            MapBackground.$on('drawn', updateTarget);
            CurrentCharacter.then(function(character) {
              return character.$on('update', updateTarget);
            });
            return updateTarget();
          });
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-move-target.js.map
*/
