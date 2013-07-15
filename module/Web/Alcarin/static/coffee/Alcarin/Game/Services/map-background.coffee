'use strict'

namespace 'Alcarin.Game.Services', (exports, Alcarin) ->

    class Units

        constructor: (@parent)->

        center: -> @toPixels(@parent.center.x, @parent.center.y)

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

    exports.module.factory 'MapBackground', ['$q', ($q)->

        class Background extends Alcarin.EventsEmitter
            BackgroundReadyDefer: null

            constructor: -> @reset()

            onDrawn: =>
                UnitsConverter = new Units @
                @BackgroundReadyDefer.resolve UnitsConverter
                @$emit 'drawn', UnitsConverter

            init: (@center, info)->
                @radius = info.radius
                @charViewRadius = info.charViewRadius

            setPixelRadius: (@pixelRadius)->
            setFields: (@fields)->
                @$emit 'fieldsChanged'

            reset: ->
                @BackgroundReadyDefer.reject() if @BackgroundReadyDefer?
                @BackgroundReadyDefer = $q.defer()

            then: (what)-> @BackgroundReadyDefer.promise.then what

        new Background()
    ]
