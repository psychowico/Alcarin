'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    angular.module('@spin').directive 'alcSpin', ->
        restrict: 'A'
        scope   : false
        link    : ($scope,element,attrs)->
            $scope.$watch attrs.alcSpin, (val)->
                element.spin val