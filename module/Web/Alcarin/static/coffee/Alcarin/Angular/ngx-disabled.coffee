'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    # like ng-disabled, but recursive
    angular.module('@disabled').directive 'alcDisabled', ->
        restrict: 'A'
        link    : ($scope,element,attrs)->
            $scope.$watch attrs.alcDisabled, (val)->
                element.enable !val, true