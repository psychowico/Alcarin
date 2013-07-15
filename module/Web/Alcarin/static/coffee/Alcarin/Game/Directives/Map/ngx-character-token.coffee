'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcCharacterToken', ->
        restrict: 'A'
        scope:
            alcCharacterToken: '='
            playerCharacter: '='
        link: ($scope,$token,attrs)->
            $scope.$watch 'alcCharacterToken.pixelLoc', (loc)->
                $token.position {top: loc.y, left: loc.x} if loc
            $scope.$watch 'playerCharacter', (val)->
                isCurrentChar = val == $scope.alcCharacterToken._id
                $token.toggleClass 'current', isCurrentChar
            $scope.$watch 'alcCharacterToken.name', (val)->
                $token.attr 'title', val
