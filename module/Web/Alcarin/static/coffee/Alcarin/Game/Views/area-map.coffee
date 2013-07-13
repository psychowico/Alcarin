'use strict'

namespace 'Alcarin.Game.Views', (exports, Alcarin) ->

    exports.AreaMap = ngcontroller ['GameServer', 'CurrentCharacter', '$q', '$safeApply',
        (GameServer, CurrentCharacter, $q, $safeApply)->
            UnitsConverter = new Units @
            BackgroundReadyDefer = $q.defer()
            @BackgroundReady     = BackgroundReadyDefer.promise

            @onTerrainReady = =>
                # $safeApply @, =>
                BackgroundReadyDefer.resolve UnitsConverter

            @redrawMap = =>
                $safeApply @, =>
                    @center  = null
                    @radius  = null
                    @terrain = null

                    BackgroundReadyDefer.reject()
                    BackgroundReadyDefer = $q.defer()
                    @BackgroundReady = BackgroundReadyDefer.promise

                    GameServer.emit 'swap.all'

            GameServer.on 'terrain.swap', (terrain, radius)=>
                CurrentCharacter.then (character)=>
                    @center =
                        x: character.loc.x
                        y: character.loc.y
                    @radius  = radius
                    @terrain = terrain

            # no idea how to get canvas size without breaking angularjs rules ;)
            # so threat it as exception.
            @pixelRadius = $('.area-map canvas.terrain').width() / 2
    ]

    class Units

        constructor: (@parent)->

        toPixels: (x, y)=>
            center = @parent.center
            radius = @parent.radius
            pixelRadius = @parent.pixelRadius
            offset = {x: center.x - radius, y: center.y - radius}
            return {
                x: Math.round Math.round(x - offset.x) * pixelRadius / radius
                y: Math.round Math.round(y - offset.y) * pixelRadius / radius
            }

        toUnits: (pixelX, pixelY)=>
            center = @parent.center
            radius = @parent.radius
            pixelRadius = @parent.pixelRadius
            offset = {x: center.x - radius, y: center.y - radius}
            return {
                x: offset.x + Math.round x * radius / pixelRadius
                y: offset.y + Math.round y * radius / pixelRadius
            }
