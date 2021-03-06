'use strict'

namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    angular.module('orbis', ['@popover', '@x-editable', '@gateways', 'ngRoute',
                             '@minimap-renderer', '@animate', 'ui.event'])
           .config ['$routeProvider', ($routeProvider)->
                $routeProvider
                    .when '/groups',
                        controller: Alcarin.Orbis.Gateways.List
                        templateUrl: urls.orbis.panel + '/__gateways-list'
                    .when '/gateway/edit/:gatewayid',
                        controller: Alcarin.Orbis.Gateways.Item
                        templateUrl: urls.orbis.panel + '/__gateway-edit'
                    .when '/gateway/new/:group',
                        controller: Alcarin.Orbis.Gateways.Item
                        templateUrl: urls.orbis.panel + '/__gateway-edit'
                    .otherwise
                        redirectTo:'/groups'
            ]

    exports.App = ngcontroller ['$routeParams', 'MapInfo', (params, MapInfo)->
        @active_group = 0
        @mapinfo = ""

        MapInfo().then (info)=> @mapinfo = info
        @$on 'groupChanged', (ev, group)=>
            @active_group = group
    ]
