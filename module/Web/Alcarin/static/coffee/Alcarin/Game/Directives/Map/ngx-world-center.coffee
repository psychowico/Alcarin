'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcWorldCenter', ['MapBackground', (MapBackground)->
        restrict: 'A'
        link: ($scope,$icon,attrs)->
            MapBackground.dataReady().then (map)->
                c = map.units().center()
                length = Math.sqrt c.x * c.x + c.y * c.y
                nvector = {x: -c.x / length, y: -c.y / length}

                pradius = map.units().pixelRadius()
                pc = map.units().pixelCenter()
                newPos = {left: pc.x + nvector.x * pradius, top: pc.y + nvector.y * pradius}
                $icon.position newPos
                $icon.show()
    ]