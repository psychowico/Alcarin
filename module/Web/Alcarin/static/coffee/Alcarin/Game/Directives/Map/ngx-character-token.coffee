'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcCharacterToken', ['MapBackground', (MapBackground)->
        restrict: 'A'
        scope:
            alcCharacterToken: '='
            playerCharacter: '='
        link: ($scope,$token,attrs)->
            $scope.$watch 'alcCharacterToken.loc', (loc)->
                return if not loc?
                MapBackground.dataReady().then (map)->
                    ploc = map.units().toPixels loc.x, loc.y
                    $token.position {top: ploc.y, left: ploc.x}
                    $token.show()
            $scope.$watch 'playerCharacter', (val)->
                isCurrentChar = val == $scope.alcCharacterToken._id
                $token.toggleClass 'current', isCurrentChar
            $scope.$watch 'alcCharacterToken.name', (val)->
                $token.attr 'title', val
    ]