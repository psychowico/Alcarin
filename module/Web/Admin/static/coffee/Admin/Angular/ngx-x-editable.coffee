'use strict'

namespace 'Admin.Angular', (exports, Alcarin) ->

    #prepare x-editable defaults
    $.fn.editable.defaults.ajaxOptions = {type: 'put', dataType: 'json'}

    angular.module('@x-editable').directive 'alcXEditable', ->
            restrict:'A',
            scope: {
                options: "&alcXEditable",
            }
            link: ($scope, element,attrs)->
                options = $scope.options()
                if options.success
                    _success = options.success
                    options.success = (response,newVal)->
                        if $scope.$$phase
                            _success(response, newVal)
                        else
                            $scope.$apply -> _success(response, newVal)

                element.editable options