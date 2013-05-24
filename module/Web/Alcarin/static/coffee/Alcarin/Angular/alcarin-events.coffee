
namespace 'Alcarin.Angular', (exports, Alcarin) ->

    angular.module('alcarin-events').factory('ZF2Action', ['$q', '$http', '$rootScope', ($q, $http, $rootScope)->
        ($uri)->
            (_action, _data)->
                _url = "#{$uri}/#{_action}"
                # angularjs sending post data in way that zf2 not understanding,
                # that is why it need this hack $.param and headers

                $http({
                    method: 'POST'
                    url: _url
                    data: $.param _data
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then (response)-> response.data
    ])