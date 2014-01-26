'use strict'

namespace 'Alcarin.Game.Directives.Map.Painters', (exports, Alcarin) ->

    class exports.Terrain
        background:
            r: 0
            g: 0
            b: 255

        @NOISE_DENSITY: 20
        @NOISE_IMPACT : 0.22
        @noise        : new ROT.Noise.Simplex()
        @GRAYSCALE    : [0.3, 0.59, 0.11]

        constructor: (@canvas)->
            @prepareCanvas()

        setCenter: (@center)->
            if @center
                @center =
                    x: Math.round center.x
                    y: Math.round center.y
        setRadius: (@radius)->
        setFields: (@fields, @plots)->
        setLighting: (lighting)->
            # we transform lighting and enable grayscale
            if lighting?
                if lighting == 1
                    @lighting = undefined
                else
                    @lighting = (lighting + 0.4) / 1.4

        width: -> @canvas[0]?.width
        height: -> @canvas[0]?.height

        prepareCanvas: ->
            @context = @canvas[0].getContext '2d'
            @context.fillStyle = "black"
            @context.fillRect 0, 0, @width(), @height()
            $(@context).enableSmoothing()

        getBackbuffer: (sizeW, sizeH)->
            @backbuffer?.remove()

            @backbuffer = $ '<canvas>'
            $.extend @backbuffer[0], {width: sizeW, height: sizeH}
            @backbufferContext = @backbuffer[0].getContext '2d'
            $(@backbufferContext).enableSmoothing()

            c = @background
            c = @applyGrayscale c, @lighting if @lighting

            @backbufferContext.fillStyle = "rgb(#{~~c.r},#{~~c.g},#{~~c.b})"
            @backbufferContext.fillRect 0, 0, sizeW, sizeH
            @backbufferContext

        swapBuffer: ->
            @context.save()
            w = @backbuffer[0].width
            h = @backbuffer[0].height
            @context.drawImage @backbuffer[0], 0, 0, w, h, -5, -2, @width() + 2, @height() + 2
            @context.restore()

        applyGrayscale: (color, lighting)->
            GRAYSCALE = exports.Terrain.GRAYSCALE
            gray = GRAYSCALE[0] * color.r + GRAYSCALE[1] * color.g + GRAYSCALE[2] * color.b
            gray *= (1 - lighting)
            return {
                r: (lighting * color.r) + gray
                g: (lighting * color.g) + gray
                b: (lighting * color.b) + gray
            }

        # I tried to get effect of barren land, but with similar color
        # to original
        modPlotColor: (color)->
            rdiff = Math.floor (color.g - color.r) / 4
            bdiff = Math.floor (color.g - color.b) / 4
            return {
                r: color.r + rdiff
                g: color.g - rdiff - bdiff
                b: color.b + bdiff
            }

        redraw: =>

            NOISE_DENSITY = exports.Terrain.NOISE_DENSITY
            NOISE_IMPACT  = exports.Terrain.NOISE_IMPACT
            noise         = exports.Terrain.noise
            GRAYSCALE     = exports.Terrain.GRAYSCALE

            size          = Math.round @radius * 2
            bufferContext = @getBackbuffer size, size

            imageData = bufferContext.getImageData 0, 0, size, size
            offset = {x: @center.x - @radius, y: @center.y - @radius}

            lighting = @lighting
            c = {}
            for field in @fields
                pixelX = field.loc.x - offset.x
                pixelY = field.loc.y - offset.y
                continue if pixelX < 0 or pixelY < 0 or pixelX >= size or pixelY >= size
                color = field.land.color

                mod = Math.abs noise.get field.loc.x / NOISE_DENSITY, field.loc.y / NOISE_DENSITY

                dataOffset = 4 * (pixelY * size + pixelX)

                result = 0
                c = Alcarin.Color.intToRGB color

                plot_key = @plots.getKey field.loc
                c = @modPlotColor c if @plots.dict[plot_key]

                for cmp, i in ['r', 'g', 'b']
                    c[cmp] *= 1 - NOISE_IMPACT * ( 1 - mod )
                if lighting
                    c = @applyGrayscale c, lighting
                for cmp, i in ['r', 'g', 'b']
                    imageData.data[dataOffset + i] = ~~c[cmp]

            bufferContext.putImageData imageData, 0, 0
            @swapBuffer()
