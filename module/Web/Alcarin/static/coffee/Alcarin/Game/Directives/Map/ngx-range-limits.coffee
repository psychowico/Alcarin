'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcRangeLimits', ['MapBackground', (MapBackground)->
        restrict: 'A'
        link: ($scope,$shadow,attrs)->
            reposRange = ->
                MapBackground.dataReady().then (map)->
                    pos = map.units().pixelCenter()
                    $shadow.position {left: pos.x, top: pos.y}

                    shadowRadius = map.charViewRadius * map.pixelRadius / map.radius
                    $child = $shadow.children()
                    $child.width 2 * shadowRadius
                    $child.height 2 * shadowRadius
                    $child.position {left: -shadowRadius, top: -shadowRadius}
            MapBackground.$on 'reset', reposRange
            MapBackground.$on 'zoom', (zoom)-> $shadow.toggle !zoom
            reposRange()
    ]