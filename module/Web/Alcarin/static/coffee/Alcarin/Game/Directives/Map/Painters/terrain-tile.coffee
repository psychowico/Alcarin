'use strict'

namespace 'Alcarin.Game.Directives.Map.Painters', (exports, Alcarin) ->

    # NOISE_DENSITY = 20
    # NOISE_IMPACT  = 0.4
    NOISE_DENSITY = 10
    NOISE_IMPACT  = 0.1

    # backbuffer width
    BBWIDTH = 40
    # backbuffer height
    BBHEIGHT = 40
    BLUR = 0.2

    # it draw only one terrain tile and his neighbors(zoomed).
    # 100m/100m
    class exports.TerrainTile
        background:
            r: 0
            g: 0
            b: 255

        constructor: (@canvas)->
            @prepareCanvas()
            @Terrain = exports.Terrain

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
            GRAYSCALE = @Terrain.GRAYSCALE
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

            @backbufferContext.fillRect 0, 0, BBWIDTH, BBHEIGHT
            @backbufferContext

        swapBuffer: ->
            @context.save()
            @context.drawImage @backbuffer[0], 0, 0, BBWIDTH, BBHEIGHT, -5, -2, @width() + 2, @height() + 2
            @context.restore()

        prepareColors: ->
            center = @center
            rCenterX = Math.floor center.x
            rCenterY = Math.floor center.y
            colors = []

            #fill by bg color
            bg = @background
            colors.push bg for i in [0..8]

            i = 0
            for field in @fields
                diffX = field.loc.x - rCenterX
                diffY = field.loc.y - rCenterY
                if Math.abs(diffY) <= 1 and Math.abs(diffX) <= 1
                    color = field.land.color
                    colors[(diffY + 1) * 3 + (diffX + 1)] = Alcarin.Color.intToRGB color
                    i++
                    break if i > 8
            Terrain = @Terrain
            for i in [0..8]
                x = rCenterX - 1 + i % 3
                y = rCenterY - 1 + Math.floor(i / 3)
                mod = Math.abs Terrain.noise.get x / Terrain.NOISE_DENSITY, y / Terrain.NOISE_DENSITY
                for cmp in ['r', 'g', 'b']
                    colors[i][cmp] *= 1 - Terrain.NOISE_IMPACT * ( 1 - mod )

            return colors

        redraw: =>
            console.log @center
            size   = Math.round @radius * 2

            backbufferContext = @getBackbuffer()
            imageData = backbufferContext.getImageData 0, 0, BBWIDTH, BBHEIGHT
            offset = {x: @center.x - @radius, y: @center.y - @radius}

            lighting = @lighting
            c = {}
            center = @center

            colors = @prepareColors()

            pixelUnitsW = 1 / (BBWIDTH / 2)
            pixelUnitsH = 1 / (BBHEIGHT / 2)
            rCenterX = Math.floor center.x
            rCenterY = Math.floor center.y

            # we need blur tiles edges to have normal looking
            # map on zoom. this code can need optimizations
            blur = (cX, cY, realX, realY)->
                index = (x,y)-> (y + 1) * 3 + (x + 1)
                _index = index cX, cY
                if _index < 0 or _index > 8
                    throw Error("Something wrong with drawing alghoritm.. Index: #{_index}")

                baseColor = colors[_index]
                # this line should be removed after tests
                realXDec = Math.abs (realX % 1)

                #first bluring X edges
                if realXDec < BLUR
                    newCX = if realX < 0 then Math.min(cX + 1, 1) else Math.max(cX - 1, -1)
                    i = index newCX, cY
                    second = colors[i]
                    usage = 0.5*(BLUR-realXDec)/BLUR
                    baseColor = Alcarin.Color.mix baseColor, second, usage
                else if realXDec > 1 - BLUR
                    newCX = if realX >= 0 then Math.min(cX + 1, 1) else Math.max(cX - 1, -1)
                    i = index newCX, cY
                    second = colors[i]
                    usage = -0.5*(1 - BLUR - realXDec)/BLUR
                    baseColor = Alcarin.Color.mix baseColor, second, usage

                realYDec = Math.abs (realY % 1)
                # next Y edges
                if realYDec < BLUR
                    newCY = if realY < 0 then Math.min(cY + 1, 1) else Math.max(cY - 1, -1)
                    i = index cX, newCY
                    second = colors[i]
                    usage = 0.5*(BLUR-realYDec)/BLUR
                    baseColor = Alcarin.Color.mix baseColor, second, usage
                else if realYDec > 1 - BLUR
                    newCY = if realY >= 0 then Math.min(cY + 1, 1) else Math.max(cY - 1, -1)
                    i = index cX, newCY
                    second = colors[i]
                    usage = -0.5*(1 - BLUR - realYDec)/BLUR
                    baseColor = Alcarin.Color.mix baseColor, second, usage

                # realYDec = (realY % 1)
                # if realYDec > -0.1 and realYDec < 0.1 and Math.random() > 0.5
                #     if realYDec > 0 then cY = Math.max(cY - 1, -1)
                #     if realYDec < 0 then cY = Math.min(cY + 1, 1)
                return baseColor

            selectColor = (x, y)->
                x -= (BBWIDTH / 2)
                y -= (BBHEIGHT / 2)
                realX = center.x + x * pixelUnitsW
                realY = center.y + y * pixelUnitsH
                cX = Math.floor realX - Math.floor center.x
                cY = Math.floor realY - Math.floor center.y

                return blur cX, cY, realX, realY

            Terrain = @Terrain
            for y in [0..BBHEIGHT]
                for x in [0..BBWIDTH]
                    c = selectColor x, y
                    offsetX = (BBWIDTH * center.x / 2) + x
                    offsetY = (BBHEIGHT * center.y / 2) + y
                    mod = Math.abs Terrain.noise.get offsetX / NOISE_DENSITY, offsetY / NOISE_DENSITY
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