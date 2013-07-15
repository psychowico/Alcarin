'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcWorldCenter', ['MapBackground', (MapBackground)->
        restrict: 'A'
        link: ($scope,$icon,attrs)->
            MapBackground.$on 'drawn', (units)->
                c = units.center()
                length = Math.sqrt c.x * c.x + c.y * c.y
                nvector = {x: -c.x / length, y: -c.y / length}

                pradius = units.pixelRadius()
                pc = units.pixelCenter()
                $icon.position {left: pc.x + nvector.x * pradius, top: pc.y + nvector.y * pradius}
                $icon.show()
    ]