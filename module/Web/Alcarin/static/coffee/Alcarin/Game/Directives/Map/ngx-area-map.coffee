'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcAreaMap', ['MapBackground', (MapBackground)->
            restrict:'A'
            link: ($scope, element, attrs)->
                Painters = Alcarin.Game.Directives.Map.Painters

                terrain = new Painters.Terrain element
                terrainTile = new Painters.TerrainTile element

                redrawAll = ->
                    MapBackground.dataReady().then (map)->
                        _terrain = if map.zoom then terrainTile else terrain
                        info = map.info
                        _terrain.setCenter info.center
                        _terrain.setRadius info.radius if _terrain.setRadius?
                        _terrain.setFields info.fields, info.plots
                        _terrain.setLighting info.lighting
                        _terrain.redraw()

                element.data 'rel', [terrain, terrainTile]
                MapBackground.$on 'reset', redrawAll
                MapBackground.$on 'zoom', redrawAll
                redrawAll()
    ]
