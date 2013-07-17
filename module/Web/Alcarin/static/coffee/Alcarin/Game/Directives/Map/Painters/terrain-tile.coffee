'use strict'

namespace 'Alcarin.Game.Directives.Map.Painters', (exports, Alcarin) ->

    # NOISE_DENSITY = 20
    # NOISE_IMPACT  = 0.4
    NOISE_DENSITY = 10
    NOISE_IMPACT  = 0.1
    noise         = new ROT.Noise.Simplex()
    GRAYSCALE     = [0.3, 0.59, 0.11]

    # backbuffer width
    BBWIDTH = 40
    # backbuffer height
    BBHEIGHT = 40

    # it draw only one terrain tile (zoomed).
    # 100m/100m
    class exports.TerrainTile
        background:
            r: 0
            g: 0
            b: 255

        constructor: (@canvas)->
            @prepareCanvas()

        setCenter: (@center)->
        setFields: (@fields)->
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

        applyGrayscale: (color, lighting)->
            gray = GRAYSCALE[0] * color.r + GRAYSCALE[1] * color.g + GRAYSCALE[2] * color.b
            gray *= (1 - lighting)
            return {
                r: (lighting * color.r) + gray
                g: (lighting * color.g) + gray
                b: (lighting * color.b) + gray
            }

        getBackbuffer: ->
            @backbuffer?.remove()

            @backbuffer = $ '<canvas>'
            $.extend @backbuffer[0], {width: BBWIDTH, height: BBHEIGHT}
            @backbufferContext = @backbuffer[0].getContext '2d'
            $(@backbufferContext).enableSmoothing()

            # c = @background
            # c = @applyGrayscale c, @lighting if @lighting

            # @backbufferContext.fillStyle = "rgb(#{~~c.r},#{~~c.g},#{~~c.b})"
            @backbufferContext.fillRect 0, 0, BBWIDTH, BBHEIGHT
            @backbufferContext

        swapBuffer: ->
            @context.save()
            @context.drawImage @backbuffer[0], 0, 0, BBWIDTH, BBHEIGHT, -5, -2, @width() + 2, @height() + 2
            @context.restore()

        redraw: =>
            size   = Math.round @radius * 2

            backbufferContext = @getBackbuffer()
            imageData = backbufferContext.getImageData 0, 0, BBWIDTH, BBHEIGHT
            offset = {x: @center.x - @radius, y: @center.y - @radius}

            lighting = @lighting
            c = {}
            center = @center
            rCenterX = Math.round center.x
            rCenterY = Math.round center.y
            for field in @fields
                if field.loc.x is rCenterX and field.loc.y is rCenterY
                    color = field.land.color
                    break

            c = if color? then Alcarin.Color.intToRGB color else @background

            console.log "drawing minimap:"
            console.log center
            for y in [0..BBHEIGHT]
                for x in [0..BBWIDTH]
                    offsetX = (BBWIDTH * center.x / 2) + x
                    offsetY = (BBHEIGHT * center.y / 2) + y
                    mod = Math.abs noise.get offsetX / NOISE_DENSITY, offsetY / NOISE_DENSITY
                    pixel = {}
                    for cmp in ['r', 'g', 'b']
                        pixel[cmp] = c[cmp] * (1 - NOISE_IMPACT * ( 1 - mod ))
                    if lighting
                        pixel = @applyGrayscale pixel, lighting
                    dataOffset = 4 * (y * BBWIDTH + x)
                    for cmp, i in ['r', 'g', 'b']
                        imageData.data[dataOffset + i] = ~~pixel[cmp]

            backbufferContext.putImageData imageData, 0, 0
            @swapBuffer()