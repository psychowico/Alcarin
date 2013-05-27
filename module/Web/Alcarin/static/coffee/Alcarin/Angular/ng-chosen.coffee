'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    angular.module('ng-chosen').directive 'ngChosenWatch', ->
        linker = ($scope,element,attrs)->
            model = attrs['ngModel']

            $scope.$watch attrs['ngChosenWatch'], ->
                element.trigger 'liszt:updated'

            # Added this in so that you could preselect items
            $scope.$watch model, ->
                element.trigger "liszt:updated"
        {
            restrict:'A',
            link: linker
        }