'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcCharacterToken', ['MapBackground', 'CurrentCharacter', '$q',
        (MapBackground, CurrentChar, $q)->
            restrict: 'A'
            scope:
                alcCharacterToken: '='
                playerCharacter: '='
            link: ($scope,$token,attrs)->
                resetTitle = ->
                    loc = $scope.alcCharacterToken.loc
                    text = $scope.alcCharacterToken.name
                    $q.all([CurrentChar, MapBackground.dataReady()]).then ([current, map])->
                        cloc = current.loc
                        distance = Math.sqrt Math.pow(cloc.x - loc.x, 2) + Math.pow(cloc.y - loc.y, 2)
                        hearable = distance <= map.info.talkRadius

                        distance /= 10
                        if distance < 1
                            distance = Math.round distance*1000
                            _end = 'm'
                        else
                            distance = Math.round distance
                            _end = 'km'
                        text += "\n#{distance}#{_end}" if distance > 0
                        $token.attr 'title', text
                        $token.toggleClass 'hearable', hearable
                resetPosition = ->
                    $token.data 'rel', $scope.alcCharacterToken
                    loc = $scope.alcCharacterToken?.loc
                    return if not loc?
                    MapBackground.dataReady().then (map)->
                        ploc = map.units().toPixels loc.x, loc.y
                        $token.position {top: ploc.y, left: ploc.x}
                        resetTitle()
                        $token.show()

                $scope.$watch 'alcCharacterToken.loc', resetPosition
                MapBackground.$on 'zoom', resetPosition

                $scope.$watch 'playerCharacter', (val)->
                    isCurrentChar = val == $scope.alcCharacterToken._id
                    $token.toggleClass 'current', isCurrentChar
                $scope.$watch 'alcCharacterToken.name', resetTitle
    ]
