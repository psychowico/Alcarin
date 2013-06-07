'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    angular.module('@animate').directive 'alcAnimateInPlace', ->
        restrict:'A',
        link: ($scope,element,attrs)->
            $scope.$on '$viewContentLoaded', ->
                element.children().css
                    position: 'absolute'
                    left    : '0'
                    right   : '0'
