'use strict'

namespace 'Alcarin.Game.Services', (exports, Alcarin) ->

    class Units

        update: (@parent, round=true)->
            @round = if round then Math.floor else (x)->x

        pixelCenter: -> @toPixels(@parent.center.x, @parent.center.y)
        center: -> @parent.center
        pixelRadius: -> @parent.pixelRadius
        radius: -> @parent.radius

        toPixels: (x, y)=>
            center = @center()
            radius = @radius()
            pixelRadius = @pixelRadius()
            # pixelRadius = 92.5

            round = @round
            offset = {x: round(center.x) - radius, y: round(center.y) - radius}
            return {
                x: Math.floor round(x - offset.x) * pixelRadius / radius
                y: Math.floor round(y - offset.y) * pixelRadius / radius
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
                # dataReadyDeffered: null
                initializedDeffered: null

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
                    [terrain, plots, info] = terrainArgs
                    radius = info.radius
                    radius /= ZOOM_FACTOR if @zoom
                    @info =
                        center        : character.loc
                        fields        : terrain
                        plots         : @preparePlots plots
                        radius        : radius
                        charViewRadius: info.charViewRadius
                        talkRadius    : info.talkRadius
                        lighting      : info.lighting
                        pixelRadius   : @pixelRadius

                    @_units = new Units if not @_units?
                    @_units.update @info, not @zoom

                    @initializedDeffered.resolve @
                    # map reloaded means, that all map has been changed some way,
                    # in most cases it will be current character travel event
                    @$emit 'swap', @
                    # @dataReadyDeffered.resolve @

                # we need fast way to check that specific pixel is
                # a plot, so we can draw map in real time faster.
                preparePlots: (grouped_plots)->
                    dict_plots = {}
                    getKey = (loc)-> Math.floor(loc.x) + ';' + Math.floor(loc.y)
                    for id, plots of grouped_plots
                        for plot in plots
                            identify = getKey(plot.loc)
                            dict_plots[identify] = id

                    return {
                        getKey: getKey
                        dict: dict_plots
                        data: grouped_plots
                    }

                reset: ->
                    # redraw call.. fetching data..
                    @initializedDeffered = $q.defer() if not @initializedDeffered?
                    # @dataReadyDeffered.reject() if @dataReadyDeffered?

                    @center = @radius = @charViewRadius = @lighting = undefined

                    swapingTerrain = GameServer.one 'terrain.swap'
                    swapingChars   = GameServer.one 'chars.swap'
                    # @dataReadyDeffered     = $q.defer()

                    loadingData = $q.all([CurrentCharacter, swapingTerrain, swapingChars])
                    loadingData.then @onDataReady

                    @$emit 'reset'

                # map has been loaded first time
                dataReady: -> @initializedDeffered.promise

            return new Background()
    ]
