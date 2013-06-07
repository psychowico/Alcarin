'use strict'

namespace 'Admin.Angular', (exports, Alcarin) ->

    angular.module('@popover').directive 'alcPopover', ->
            restrict:'A',
            link: ($scope, element, attrs)->
                element.popover()