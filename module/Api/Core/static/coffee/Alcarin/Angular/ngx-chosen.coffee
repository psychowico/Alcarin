'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    angular.module('@chosen').directive 'alcChosenWatch', ->
        restrict:'A',
        link: ($scope,element,attrs)->
            model = attrs['ngModel']

            $scope.$watch attrs['alcChosenWatch'], ->
                element.trigger 'liszt:updated'

            # Added this in so that you could preselect items
            $scope.$watch model, ->
                element.trigger "liszt:updated"
