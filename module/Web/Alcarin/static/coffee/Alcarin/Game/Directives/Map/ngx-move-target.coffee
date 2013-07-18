'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcMoveTarget', ['CurrentCharacter', 'MapBackground', 'CharEnvironment',
        (CurrentCharacter, MapBackground, CharEnvironment) ->
            restrict: 'A'
            link: ($scope, $token,attrs)->

                updateTarget = ->
                    MapBackground.dataReady().then (map)->
                        focusOn = (target)->
                            loc = map.units().toPixels target.x, target.y
                            $token.position {left: loc.x, top: loc.y}

                        CurrentCharacter.then (character)->
                            visible = character.move?.target?
                            if visible
                                target = character.move.target
                                if target.type? and target.type is 'char'
                                    CharEnvironment.character(target.id).then (target)->
                                        focusOn target.loc
                                else
                                    focusOn character.move.target
                            $token.toggle visible

                CurrentCharacter.then (character)->
                    character.$on 'update', updateTarget
                MapBackground.$on 'zoom', updateTarget
                updateTarget()
        ]