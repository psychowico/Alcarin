'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    angular.module('@character-token').directive 'alcCharacterToken', ->
        restrict: 'A'
        scope:
            alcCharacterToken: '='
            playerCharacter: '='
        link: ($scope,element,attrs)->

            $scope.$watch 'alcCharacterToken.pixelLoc', (loc)->
                if loc
                    element.position {top: loc.y, left: loc.x}
            $scope.$watch 'playerCharacter', (val)->
                if val == $scope.alcCharacterToken._id
                    element.addClass('current')
                else
                    element.removeClass('current')
