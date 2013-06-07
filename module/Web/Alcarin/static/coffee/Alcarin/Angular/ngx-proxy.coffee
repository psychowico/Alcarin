'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    module = angular.module '@proxy', ['ngResource']

    # redefining default resource to make little more friendly interface
    module.factory 'alc-resource', ['$resource', ($res)->
        (uri, params, methods)->
            methods = $.extend methods or {},
                create: { method: 'POST' }
                save: { method: 'PUT' }
            $res uri, params, methods
    ]