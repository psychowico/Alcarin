'use strict'

namespace 'Alcarin.Game.Map', (exports, Alcarin) ->

    class MapAreaServices
        services : {}

        set: (key, service)-> @services[key] = service
        get: (key)-> return @services[key] if @services[key]


    angular.module('@area-map', ['@game-services'])
        .directive 'alcAreaMap', ['GameServer', 'CurrentCharacter', (GameServer, Character)->
            restrict:'A'
            link: ($scope, element, attrs)->
                $ ->
                    mapLayers = [
                        Alcarin.Game.Map.Layers.Terrain
                        Alcarin.Game.Map.Layers.CharViewRange
                        Alcarin.Game.Map.Layers.Characters
                    ]

                    services = new MapAreaServices()
                    services.set 'GameServer', GameServer
                    services.set 'CoordConverter', Alcarin.Game.Map.CoordConverter

                    painter = new Alcarin.Map.Painter element, mapLayers, services
                    painter.setTarget Character
                    element.data 'map-painter', painter
    ]