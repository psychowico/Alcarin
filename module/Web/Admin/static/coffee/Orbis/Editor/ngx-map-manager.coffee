'use strict'

namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    canvas_events = ($scope, map, element)->
        class events
            mouse_down: (e)=>
                return false if $(e.currentTarget).disabled()
                element.on 'mousemove', @mouse_painting
                @mouse_painting e

            mouse_up:  =>
                element.off 'mousemove', @mouse_painting

            mouse_move: (e)=>
                map.draw_shadow {x: e.offsetX, y: e.offsetY}, $scope.mapBrush

            mouse_painting: (e)=>
                coords = map.pixels_to_coords e.offsetX, e.offsetY
                brush = $scope.mapBrush
                if brush.size > 1
                    range   = brush.size - 1
                    range_2 = range * range
                    for oy in [-range..range]
                        for ox in [-range..range]
                            if oy * oy + ox * ox <= range_2
                                map.put_field coords.x + ox, coords.y + oy, brush
                else
                    map.put_field coords.x, coords.y, brush

                map.confirm_changes()
        new events()

    angular.module('@map-manager').directive 'alcMapManager',
        ['@EventsBus', (EventsBus)->
            restrict:'A'
            scope:
                onMapChange: '&mapChange'
                changes: '=mapChanges'
                mapFields : '='
                mapCenter : '='
                mapSize   : '='
                mapBrush  : '='
            link: ($scope,canvas,attrs)->
                map = new Alcarin.Orbis.Editor.MapManager $scope, canvas
                map.init()

                map.change_happen = ->
                    if $scope.$$phase
                        $scope.onMapChange()
                    else
                        $scope.$apply -> $scope.onMapChange()

                $scope.$watch 'mapFields', (val)->
                    if val? and $scope.mapSize > 0
                        map.set_center $scope.mapCenter.x, $scope.mapCenter.y
                        map.redraw $scope.mapSize, val

                ev = canvas_events $scope, map, canvas.parent()
                canvas.parent().on('mousedown', ev.mouse_down)
                      .on('mousemove', ev.mouse_move)
                $(document).on 'mouseup', ev.mouse_up
        ]