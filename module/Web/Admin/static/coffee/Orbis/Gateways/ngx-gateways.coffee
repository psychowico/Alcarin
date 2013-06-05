namespace 'Alcarin.Orbis.Gateways', (exports, Alcarin) ->

    angular.module('@gateways', ['@proxy'])
        .factory('GatewaysGroup', ['alc-resource', ($res)->
            Group = $res urls.orbis.gatewaysgroups + '/:groupid', {groupid: '@id'}
            Group.prototype.displayname = ->
                    if @name == "0" then 'Ungrouped' else @name
            Group
        ])
        .factory('Gateway', ['alc-resource', ($res)->
            $res urls.orbis.gateways + '/:id', {id: "@id"}
        ])
