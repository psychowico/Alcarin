'use strict';
namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  return exports.module.directive('alcMoveTarget', [
    'CurrentCharacter', 'MapBackground', 'CharEnvironment', function(CurrentCharacter, MapBackground, CharEnvironment) {
      return {
        restrict: 'A',
        link: function($scope, $token, attrs) {
          return MapBackground.dataReady().then(function(map) {
            var updateTarget;
            updateTarget = function() {
              var focusOn;
              focusOn = function(target) {
                var loc;
                loc = map.units().toPixels(target.x, target.y);
                return $token.position({
                  left: loc.x,
                  top: loc.y
                });
              };
              return CurrentCharacter.then(function(character) {
                var target, visible, _ref;
                visible = ((_ref = character.move) != null ? _ref.target : void 0) != null;
                if (visible) {
                  target = character.move.target;
                  if ((target.type != null) && target.type === 'char') {
                    CharEnvironment.character(target.id).then(function(target) {
                      return focusOn(target.loc);
                    });
                  } else {
                    focusOn(character.move.target);
                  }
                }
                return $token.toggle(visible);
              });
            };
            CurrentCharacter.then(function(character) {
              return character.$on('update', updateTarget);
            });
            MapBackground.$on('swap', updateTarget);
            MapBackground.$on('zoom', updateTarget);
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
