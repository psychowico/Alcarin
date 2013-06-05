'use strict'

namespace 'Admin.Angular', (exports, Alcarin) ->

    angular.module('alc-popover').directive 'alcPopover', ->
            restrict:'A',
            link: ($scope, element,attrs)->
                element.popover()