namespace 'Alcarin.Orbis.Gateways', (exports, Alcarin) ->

    angular.module('ng-gateways', ['ngResource'])
        .factory('GatewaysGroup', ['$resource', ($resource)->
            Group = $resource urls.orbis.gatewaysgroups + '/:groupid', {groupid: '@id'}
                create: { method: 'POST' }
                save: { method: 'PUT' }
            Group.prototype.displayname = ->
                    if @name == "0" then 'Ungrouped' else @name
            Group
        ])
        .factory('Gateway', ['$resource', ($resource)->
            $resource urls.orbis.gateways + '/:id'
        ])
