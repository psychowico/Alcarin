'use strict'

namespace 'Alcarin.Map', (exports, Alcarin) ->

    class CoordConverter

        constructor: (@center, @radius, @pixelRadius)->

        toPixels: (x, y)->
            offset = {x: @center.x - @radius, y: @center.y - @radius}
            return {
                x: Math.round (x - offset.x) * @pixelRadius / @radius
                y: Math.round (y - offset.y) * @pixelRadius / @radius
            }

        toUnits: (pixelX, pixelY)->
            offset = {x: @center.x - @radius, y: @center.y - @radius}
            return {
                x: offset.x + Math.round x * @radius / @pixelRadius
                y: offset.y + Math.round y * @radius / @pixelRadius
            }

    deffered = Q.defer()
    exports.CoordConverter = deffered.promise
    exports.CoordConverter.init = (center, radius, pixelRadius)->
        converter = new CoordConverter center, radius, pixelRadius
        deffered.resolve converter
