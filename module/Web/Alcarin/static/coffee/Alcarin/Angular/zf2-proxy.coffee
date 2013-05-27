'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    module = angular.module('zf2-proxy')

    # zf2 action controllers connection model
    module.factory 'ZF2Action', ['$http', ($http)->
        ($uri)->
            zf2query = (_action, _params, _callback)->
                _url = "#{$uri}/#{_action}"
                # angularjs sending post data in way that zf2/php not understanding,
                # that is why it need this hack $.param and headers
                _params.url = _url

                result = $http _params

                return result.success _callback if _callback
                result.then (response)-> response.data

            zf2action = (_action, _data, _callback)->
                zf2action.get.call(zf2action, _action, _data, _callback)

            zf2action.get = (_action, _data, _callback)->
                zf2query _action, {
                    method: 'GET'
                    params: _data
                }, _callback

            zf2action.post = (_action, _data, _callback)->
                zf2query _action, {
                    method: 'POST'
                    data: $.param _data
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }, _callback

            zf2action
    ]