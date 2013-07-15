'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcRangeLimits', ['MapBackground', (MapBackground)->
        restrict: 'A'
        link: ($scope,$shadow,attrs)->
            MapBackground.$on 'drawn', (units)->
                pos = units.pixelCenter()
                $shadow.position {left: pos.x, top: pos.y}

                shadowRadius = MapBackground.charViewRadius * MapBackground.pixelRadius / MapBackground.radius
                $child = $shadow.children()
                $child.width 2 * shadowRadius
                $child.height 2 * shadowRadius
                $child.position {left: -shadowRadius, top: -shadowRadius}
    ]