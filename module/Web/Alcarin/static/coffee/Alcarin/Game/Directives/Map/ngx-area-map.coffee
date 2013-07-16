'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcAreaMap', ['MapBackground', (MapBackground)->
            restrict:'A'
            link: ($scope, element, attrs)->
                $ ->
                    terrain = new Terrain element
                    terrain.$on 'drawn', MapBackground.onDrawn
                    MapBackground.$on 'fieldsChanged', ->
                        terrain.setCenter MapBackground.center
                        terrain.setRadius MapBackground.radius
                        terrain.setFields MapBackground.fields
                        terrain.setLighting MapBackground.lighting
                        terrain.redraw()

                    element.data 'rel', terrain
    ]

    NOISE_DENSITY = 25
    NOISE_IMPACT  = 0.22
    noise         = new ROT.Noise.Simplex()
    GRAYSCALE     = [0.3, 0.59, 0.11]

    class Terrain extends Alcarin.EventsEmitter
        background:
            r: 0
            g: 0
            b: 255

        constructor: (@canvas)->
            @prepareCanvas()

        setCenter: (@center)->
            if @center
                @center =
                    x: Math.round center.x
                    y: Math.round center.y
        setRadius: (@radius)->
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
            $(@context).disableSmoothing()

        getBackbuffer: (sizeW, sizeH)->
            @backbuffer?.remove()

            @backbuffer = $ '<canvas>'
            $.extend @backbuffer[0], {width: sizeW, height: sizeH}
            @backbufferContext = @backbuffer[0].getContext '2d'
            $(@backbufferContext).disableSmoothing()

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
            @$emit 'drawn'

        applyGrayscale: (color, lighting)->
            gray = GRAYSCALE[0] * color.r + GRAYSCALE[1] * color.g + GRAYSCALE[2] * color.b
            gray *= (1 - lighting)
            return {
                r: (lighting * color.r) + gray
                g: (lighting * color.g) + gray
                b: (lighting * color.b) + gray
            }

        redraw: =>
            size          = @radius * 2
            bufferContext = @getBackbuffer size, size

            imageData = bufferContext.getImageData 0, 0, size, size
            offset = {x: @center.x - @radius, y: @center.y - @radius}

            # canvasTitle = "View radius: #{radius / 10}km"
            # @canvas.parent().tooltip {title: canvasTitle, placement: 'bottom'}

            lighting = @lighting
            # console.log lighting
            c = {}
            for field in @fields
                color = field.land.color

                pixelX = field.loc.x - offset.x
                pixelY = field.loc.y - offset.y

                mod = Math.abs noise.get field.loc.x / NOISE_DENSITY, field.loc.y / NOISE_DENSITY

                dataOffset = 4 * (pixelY * size + pixelX)

                # color =
                #     r: unpack color, 0, mod
                #     g: unpack color, 1, mod
                #     b: unpack color, 2, mod
                result = 0
                for cmp, i in ['r', 'g', 'b']
                    c[cmp] = ((color >> (8 * (2 - i) ) ) & 0xFF)
                    # @plain_colors[_offset + i] = c
                    c[cmp] *= 1 - NOISE_IMPACT * ( 1 - mod )
                if lighting
                    c = @applyGrayscale c, lighting
                for cmp, i in ['r', 'g', 'b']
                    imageData.data[dataOffset + i] = ~~c[cmp]

            bufferContext.putImageData imageData, 0, 0
            @swapBuffer()