'use strict'

namespace 'Alcarin.Game.Services', (exports, Alcarin) ->

    class Units

        constructor: (@parent)->

        pixelCenter: -> @toPixels(@parent.center.x, @parent.center.y)
        center: -> @parent.center
        pixelRadius: -> @parent.pixelRadius
        radius: -> @parent.radius

        toPixels: (x, y)=>
            center = @center()
            radius = @radius()
            pixelRadius = @pixelRadius()
            offset = {x: Math.round(center.x) - radius, y: Math.round(center.y) - radius}
            return {
                x: Math.round Math.round(x - offset.x) * pixelRadius / radius
                y: Math.round Math.round(y - offset.y) * pixelRadius / radius
            }

        toUnits: (pixelX, pixelY)=>
            center = @center()
            radius = @radius()
            pixelRadius = @pixelRadius()
            offset = {x: Math.round(center.x) - radius, y: Math.round(center.y) - radius}
            return {
                x: offset.x + Math.round pixelX * radius / pixelRadius
                y: offset.y + Math.round pixelY * radius / pixelRadius
            }

    ZOOM_FACTOR = 5
    exports.module.factory 'MapBackground', ['$q', 'GameServer', 'CurrentCharacter',
        ($q, GameServer, CurrentCharacter)->

            class Background extends Alcarin.EventsEmitter
                dataReadyDeffered: null

                constructor: -> @reset()

                setPixelRadius: (@pixelRadius)->

                units: -> @_units

                enableZoom: (@zoom)->
                    factor = if @zoom then 1 / ZOOM_FACTOR else ZOOM_FACTOR
                    @radius *= factor
                    @$emit 'zoom', @zoom

                onDataReady: (args)=>
                    # all data needed to draw map has been loaded
                    [character, terrainArgs, charsArgs] = args

                    [terrain, info] = terrainArgs
                    @center         = character.loc
                    @fields         = terrain
                    @radius         = info.radius
                    @radius /= ZOOM_FACTOR if @zoom
                    @charViewRadius = info.charViewRadius
                    @lighting       = info.lighting

                    @_units = new Units @
                    @dataReadyDeffered.resolve @

                reset: ->
                    # redraw call.. fetching data..
                    @dataReadyDeffered.reject() if @dataReadyDeffered?
                    @center = @radius = @charViewRadius = @lighting = undefined

                    swapingTerrain = GameServer.one 'terrain.swap'
                    swapingChars   = GameServer.one 'chars.swap'
                    @dataReadyDeffered     = $q.defer()

                    loadingData = $q.all([CurrentCharacter, swapingTerrain, swapingChars])
                    loadingData.then @onDataReady

                    @$emit 'reset'

                dataReady: -> @dataReadyDeffered.promise

            return new Background()
    ]
