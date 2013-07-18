'use strict'

namespace 'Alcarin.Game.Services', (exports, Alcarin) ->

    class Units

        constructor: (@parent, round=true)->
            @round = if round then Math.round else (x)->x

        pixelCenter: -> @toPixels(@parent.center.x, @parent.center.y)
        center: -> @parent.center
        pixelRadius: -> @parent.pixelRadius
        radius: -> @parent.radius

        toPixels: (x, y)=>
            center = @center()
            radius = @radius()
            pixelRadius = @pixelRadius()

            round = @round
            offset = {x: round(center.x) - radius, y: round(center.y) - radius}
            return {
                x: Math.round round(x - offset.x) * pixelRadius / radius
                y: Math.round round(y - offset.y) * pixelRadius / radius
            }

        toUnits: (pixelX, pixelY)=>
            center = @center()
            radius = @radius()
            pixelRadius = @pixelRadius()
            round = @round
            offset = {x: round(center.x) - radius, y: round(center.y) - radius}
            return {
                x: offset.x + round pixelX * radius / pixelRadius
                y: offset.y + round pixelY * radius / pixelRadius
            }

    ZOOM_FACTOR = 30
    exports.module.factory 'MapBackground', ['$q', 'GameServer', 'CurrentCharacter',
        ($q, GameServer, CurrentCharacter)->

            class Background extends Alcarin.EventsEmitter
                dataReadyDeffered: null
                zoom: false

                constructor: -> @reset()

                setPixelRadius: (@pixelRadius)->

                units: -> @_units

                enableZoom: (@zoom)->
                    if @info?
                        factor = if @zoom then 1 / ZOOM_FACTOR else ZOOM_FACTOR
                        @info.radius *= factor
                        @_units = new Units @info, not @zoom
                    @$emit 'zoom', @zoom

                # all data needed to draw map has been loaded
                onDataReady: ([character, terrainArgs, charsArgs])=>
                    [terrain, info] = terrainArgs

                    radius = info.radius
                    radius /= ZOOM_FACTOR if @zoom
                    @info =
                        center        : character.loc
                        fields        : terrain
                        radius        : radius
                        charViewRadius: info.charViewRadius
                        talkRadius    : info.talkRadius
                        lighting      : info.lighting
                        pixelRadius   : @pixelRadius

                    @_units = new Units @info, not @zoom
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
