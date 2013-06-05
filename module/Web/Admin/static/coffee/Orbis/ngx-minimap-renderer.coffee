'use strict'

namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    angular.module('@minimap-renderer').directive 'alcMinimapRenderer',
        [ '$rootScope', ($rootScope)->
            restrict:'A',
            link: ($scope, el,attrs)->
                map = new Alcarin.Orbis.MinimapRenderer el
                map.init()

                $scope.$on 'mouse-enter-gateway', (ev, x, y)=>
                    el.data('flag')?.destroy()
                    flag = map.create_flag x, y
                    flag.drop (ev)->
                        p      = ev.position
                        coords = map.to_coords p.left, p.top
                        $rootScope.$broadcast 'flag-updated', coords.x, coords.y
                    el.data 'flag', flag
                    flag.show()
                $scope.$on 'mouse-leave-gateway', =>
                    el.data('flag')?.destroy()
                    el.removeData 'flag'
        ]