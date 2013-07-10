'use strict'

namespace 'Alcarin.Map', (exports, Alcarin) ->

    class MapAreaServices
        services : {}

        set: (key, service)-> @services[key] = service
        get: (key)-> return @services[key] if @services[key]

    mapLayers = [
        Alcarin.Map.Layers.Terrain
        Alcarin.Map.Layers.CharViewRange
        Alcarin.Map.Layers.Characters
    ]

    angular.module('@area-map', ['@game-services'])
        .directive 'alcAreaMap', ['GameServer', 'CurrentCharacter', (GameServer, Character)->
                restrict:'A'
                link: ($scope, element, attrs)->
                    services = new MapAreaServices()
                    services.set 'GameServer', GameServer
                    services.set 'CoordConverter', Alcarin.Map.CoordConverter

                    painter = new Alcarin.Map.Painter element, mapLayers, services
                    painter.setTarget Character
                    element.data 'map-painter', painter
    ]