'use strict';namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return angular.module('@move-target').directive('alcMoveTarget', [
    'CurrentCharacter', 'MapBackground', function(CurrentCharacter, MapBackground) {
      return {
        restrict: 'A',
        link: function($scope, $token, attrs) {
          return MapBackground.$on('drawn', function(units) {
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
          });
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-move-target.js.map
*/
