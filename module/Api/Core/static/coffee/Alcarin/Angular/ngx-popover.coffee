'use strict'

namespace 'Admin.Angular', (exports, Alcarin) ->

    angular.module('@popover').directive 'alcPopover', ->
            restrict:'A',
            scope:
                _content: "@alcPopover"
            link: ($scope, element, attrs)->
                $scope.$watch '_content', (val)->
                    element.data('popover').options.content = val
                element.popover()
