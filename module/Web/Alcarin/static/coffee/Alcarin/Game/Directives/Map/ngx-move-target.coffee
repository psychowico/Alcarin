'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcMoveTarget', ['CurrentCharacter', 'MapBackground',
        (CurrentCharacter, MapBackground) ->
            restrict: 'A'
            link: ($scope, $token,attrs)->

                updateTarget = ->
                    MapBackground.dataReady().then (map)->
                        CurrentCharacter.then (character)->
                            visible = character.move?.target?
                            if visible
                                target = character.move.target
                                loc = map.units().toPixels target.x, target.y
                                $token.position {left: loc.x, top: loc.y}
                            $token.toggle visible

                CurrentCharacter.then (character)->
                    character.$on 'update', updateTarget
                MapBackground.$on 'zoom', updateTarget
                updateTarget()
        ]