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
                        terrain.redraw()

                    element.data 'rel', terrain
    ]

    NOISE_DENSITY = 25
    NOISE_IMPACT  = 0.22
    noise         = new ROT.Noise.Simplex()

    class Terrain extends Alcarin.EventsEmitter
        background: 'rgb(0,0,255)'

        constructor: (@canvas)->
            @prepareCanvas()

        setCenter: (@center)->
            if @center
                @center =
                    x: Math.round center.x
                    y: Math.round center.y
        setRadius: (@radius)->
        setFields: (@fields)->

        width: -> @canvas[0]?.width
        height: -> @canvas[0]?.height

        prepareCanvas: ->
            @context = @canvas[0].getContext '2d'
            @context.fillStyle = @background
            @context.fillRect 0, 0, @width(), @height()
            $(@context).disableSmoothing()

        getBackbuffer: (sizeW, sizeH)->
            @backbuffer?.remove()

            @backbuffer = $ '<canvas>'
            $.extend @backbuffer[0], {width: sizeW, height: sizeH}
            @backbufferContext = @backbuffer[0].getContext '2d'
            $(@backbufferContext).disableSmoothing()

            @backbufferContext.fillStyle = @background
            @backbufferContext.fillRect 0, 0, sizeW, sizeH
            @backbufferContext

        swapBuffer: ->
            @context.save()
            w = @backbuffer[0].width
            h = @backbuffer[0].height
            @context.drawImage @backbuffer[0], 0, 0, w, h, -5, -2, @width() + 2, @height() + 2
            @context.restore()
            @$emit 'drawn'

        redraw: =>
            size          = @radius * 2
            bufferContext = @getBackbuffer size, size

            imageData = bufferContext.getImageData 0, 0, size, size
            offset = {x: @center.x - @radius, y: @center.y - @radius}

            # canvasTitle = "View radius: #{radius / 10}km"
            # @canvas.parent().tooltip {title: canvasTitle, placement: 'bottom'}

            for field in @fields
                color = field.land.color

                pixelX = field.loc.x - offset.x
                pixelY = field.loc.y - offset.y

                mod = Math.abs noise.get field.loc.x / NOISE_DENSITY, field.loc.y / NOISE_DENSITY

                dataOffset = 4 * (pixelY * size + pixelX)

                for i in [0..2]
                    c = ((color >> (8 * (2 - i) ) ) & 0xFF)
                    # @plain_colors[_offset + i] = c
                    c *= 1 - NOISE_IMPACT * ( 1 - mod )
                    imageData.data[dataOffset + i] = ~~c

            bufferContext.putImageData imageData, 0, 0
            @swapBuffer()