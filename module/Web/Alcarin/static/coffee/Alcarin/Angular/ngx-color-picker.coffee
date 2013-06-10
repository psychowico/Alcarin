'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    cthtml = (c)-> "rgb(#{c.r}, #{c.g}, #{c.b})"

    angular.module('@color-picker').directive 'alcColorPicker', ->
        restrict:'A',
        scope:
            ngModel: '='
        link: ($scope,element,attrs)->
            element.data 'color', cthtml $scope.ngModel
            $scope.$watch 'ngModel', (val)->
                element.css 'background-color', cthtml val if val?

            element.colorpicker().on 'hide', (e)=>
                rgb = e.color.toRGB()
                delete rgb['a']
                $scope.$apply -> $scope.ngModel = rgb

            element.colorpicker()
