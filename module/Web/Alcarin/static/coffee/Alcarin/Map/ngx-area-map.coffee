'use strict'

angular.module('@area-map', ['@game-services'])
    .directive 'alcAreaMap', ['GameServer', 'CurrentCharacter', (GameServer, Character)->
            restrict:'A'
            link: ($scope, element, attrs)->
                layers = [
                    Alcarin.Map.Layers.Terrain
                ]
                painter = new Alcarin.Map.Painter element, layers
                painter.setTarget Character
                element.data 'map-painter', painter

                ['terrain.swap'].forEach (eventId)->
                    GameServer.on eventId, (args...)->
                        painter.$broadcast eventId, args...
]