'use strict'

angular.module('@area-map', ['@game-services'])
    .directive 'alcAreaMap', ['GameServer', 'CurrentCharacter', (GameServer, Character)->
            restrict:'A'
            link: ($scope, element, attrs)->
                Character.then (character)->
                    console.log character
                layers = [
                    Alcarin.Map.Layers.Terrain
                ]
                painter = new Alcarin.Map.Painter element, layers
                element.data 'map-painter', painter

                ['terrain.swap'].forEach (eventId)->
                    GameServer.on eventId, (args...)->
                        painter.$broadcast eventId, args...
]