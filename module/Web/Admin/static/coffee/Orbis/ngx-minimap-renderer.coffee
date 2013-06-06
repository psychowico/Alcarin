'use strict'

namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    angular.module('@minimap-renderer').directive 'alcMinimapRenderer',
        [ '$rootScope', '@EventsBus', ($rootScope, EventsBus)->
            restrict:'A',
            link: ($scope, el,attrs)->
                map = new Alcarin.Orbis.MinimapRenderer el
                map.init()

                EventsBus.on 'mouse-enter-gateway', (x, y)->
                    el.data('flag')?.destroy()
                    flag = map.create_flag x, y
                    flag.drop (ev)->
                        p      = ev.position
                        coords = map.to_coords p.left, p.top
                        EventsBus.emit 'flag.updated', coords.x, coords.y
                    el.data 'flag', flag
                    flag.show()
                EventsBus.on 'mouse-leave-gateway', =>
                    el.data('flag')?.destroy()
                    el.removeData 'flag'
        ]