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
                        _terrain.setCenter map.center
                        _terrain.setRadius map.radius if _terrain.setRadius?
                        _terrain.setFields map.fields
                        _terrain.setLighting map.lighting
                        _terrain.redraw()

                element.data 'rel', [terrain, terrainTile]
                MapBackground.$on 'reset', redrawAll
                MapBackground.$on 'zoom', redrawAll
                redrawAll()
    ]