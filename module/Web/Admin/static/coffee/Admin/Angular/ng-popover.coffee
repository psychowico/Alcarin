'use strict'

namespace 'Admin.Angular', (exports, Alcarin) ->

    angular.module('ng-popover').directive 'ngPopover', ->
            restrict:'A',
            link: ($scope, element,attrs)->
                element.popover()