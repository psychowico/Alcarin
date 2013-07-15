'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    angular.module('@move-target').directive 'alcMoveTarget', ['CurrentCharacter', 'MapBackground',
        (CurrentCharacter, MapBackground) ->
            restrict: 'A'
            link: ($scope, $token,attrs)->
                MapBackground.$on 'drawn', (units)->
                    CurrentCharacter.then (character)->
                        visible = character.move?.target?
                        if visible
                            target = character.move.target
                            loc = units.toPixels target.x, target.y
                            $token.position {left: loc.x, top: loc.y}
                        $token.toggle visible
        ]