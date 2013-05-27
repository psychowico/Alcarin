'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    module = angular.module('zf2-proxy')

    # zf2 action controllers connection model
    module.factory 'ZF2Action', ['$http', ($http)->
        ($uri)->
            (_action, _data)->
                _url = "#{$uri}/#{_action}"
                # angularjs sending post data in way that zf2/php not understanding,
                # that is why it need this hack $.param and headers

                $http({
                    method: 'POST'
                    url: _url
                    data: $.param _data
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then (response)-> response.data
    ]