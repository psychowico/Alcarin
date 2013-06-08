'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    angular.module('@slider').directive 'jslider', ->
        restrict:'E',
        scope:
            options: '&'
            value  : '='
        link: ($scope,element,attrs)->
            element.addClass 'slider'
            options = $.extend
                change: (e, ui)->
                    if $scope.$parent.$$phase
                        $scope.value = ui.value
                    else
                        $scope.$apply -> $scope.value = ui.value


            , $scope.options()

            $scope.$watch 'value', (_val)->
                element.slider 'value', _val if _val?

            element.slider options