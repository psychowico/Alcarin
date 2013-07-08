namespace 'Admin.Map.Layers', (exports, Alcarin) ->

    canvas_events = (map, element)->
        class events
            mouse_down: (e)=>
                return false if $(e.currentTarget).disabled()
                element.on 'mousemove', @mouse_painting
                @mouse_painting e

            mouse_up:  =>
                element.off 'mousemove', @mouse_painting

            mouse_move: (e)=>
                map.draw_shadow {x: e.offsetX, y: e.offsetY}, map.mapBrush

            mouse_painting: (e)=>
                coords = map.pixels_to_coords e.offsetX, e.offsetY
                brush = map.mapBrush
                if brush.size > 1
                    range   = brush.size - 1
                    range_2 = range * range
                    for oy in [-range..range]
                        for ox in [-range..range]
                            if oy * oy + ox * ox <= range_2
                                map.put_field coords.x + ox, coords.y + oy, brush
                else
                    map.put_field coords.x, coords.y, brush

                map.confirm_changes()
        new events()

    class exports.EditableTerrain extends Alcarin.EventsEmitter
        background: [0, 0, 255]
        noise_density: 25
        noise_impact: 0.22
        mapBrush: null

        constructor: (@canvas, c_x, c_y)->
            @set_center c_x, c_y
            @$on 'set-center', @set_center
            @$on 'fields-fetched', @redraw
            @$on 'brush-changed', (brush)=> @mapBrush = brush
            @init()

            ev = canvas_events @, @canvas.parent()
            @canvas.parent()
                .on('mousedown', ev.mouse_down)
                .on('mousemove', ev.mouse_move)
            $(document).on 'mouseup', ev.mouse_up

        noise: ->
            @_noise = new ROT.Noise.Simplex if not @_noise?
            @_noise

        set_center: (c_x, c_y)=>
            @rect  = undefined
            @center = {x: c_x, y: c_y}

        draw_shadow: (p, size)->
            return false if not @foreground?

            c = @foreground_canvas[0]
            @foreground.clearRect 0, 0, c.width, c.height

            up = @unit_pixel_size()
            _size = up * (-0.5 + size )

            if _size > 0
                @foreground.beginPath();

                x = p.x #up * Math.round (p.x / up)
                y = p.y #up * Math.round (p.y / up)
                @foreground.arc x, y, _size, 0, 360
                @foreground.lineWidth = 2

                @foreground.strokeStyle = 'rgba(255, 0, 0, 0.3)'
                @foreground.stroke()

        in_view_rect: (x, y)->
            _rect = @rect or {
                left: @center.x - @size / 2
                right: @center.x + @size / 2
                top: @center.y - @size / 2
                bottom: @center.y + @size / 2
            }
            @rect = _rect
            return _rect.left <= x < _rect.right and
                    _rect.top <= y < _rect.bottom

        init_backbuffer: (sizeW, sizeH)->
            if not @backbuffer_canvas?
                @backbuffer_canvas = $ '<canvas>'

                _canvas = @backbuffer_canvas[0]
                _canvas.width = sizeW
                _canvas.height = sizeH

                @backbuffer = _canvas.getContext '2d'
                $(@backbuffer).disableSmoothing()

            @backbuffer.fillStyle = "rgb(0, 0, 255)";
            @backbuffer.fillRect 0, 0, sizeW, sizeH
            @backbuffer

        init_foreground: ->
            if not @foreground?
                @foreground_canvas = $ '<canvas>', {class: 'foreground'}

                _canvas = @foreground_canvas[0]
                _canvas.width = @canvas.width()
                _canvas.height = @canvas.height()

                @foreground = _canvas.getContext '2d'
                @foreground_canvas.appendTo @canvas.parent()
                #$(@backbuffer).disableSmoothing()

            @foreground

        init: ->
            @context = @canvas[0].getContext '2d'

            bg = @background
            @context.fillStyle = "rgb(#{bg[0]}, #{bg[1]}, #{bg[2]})";
            @context.fillRect 0, 0, @canvas.width(), @canvas.height()

            $(@context).disableSmoothing()

        redraw: (size, fields)=>
            @plain_colors = []

            @size = size
            backbuffer = @init_backbuffer size, size
            @image_data = image_data = backbuffer.getImageData 0, 0, size, size

            offset = {x: @center.x - size / 2, y: @center.y - size / 2}

            for field in fields
                color = field.land.color

                _x = field.loc.x - offset.x
                _y = field.loc.y - offset.y

                mod = Math.abs @noise().get field.loc.x / @noise_density, field.loc.y / @noise_density

                _offset = 4 * (_y * size + _x)

                for i in [0..2]
                    c = ((color >> (8 * (2 - i) ) ) & 0xFF)
                    @plain_colors[_offset + i] = c

                    c *= 1 - @noise_impact * ( 1 - mod )
                    image_data.data[_offset + i] = ~~c

            @_buffer_to_front true
            @init_foreground()
            @unsaved_changes = false

        unit_pixel_size: ()->
            @canvas[0].width / @backbuffer_canvas[0].width

        pixels_to_coords: (x, y)->
            offset = {x: @center.x - @size / 2, y: @center.y - @size / 2}
            return {
                x: offset.x + Math.round x * @backbuffer_canvas[0].width / @canvas[0].width
                y: offset.y + Math.round y * @backbuffer_canvas[0].height / @canvas[0].height
            }

        put_field: (x, y, field_brush)->
            if x? and y? and @in_view_rect x, y
                mod = Math.abs @noise().get x / @noise_density, y / @noise_density

                color = field_brush.color

                bb_pos = @_coords_to_backbuffer_pixels x, y
                offset = 4 * (bb_pos.y * @size + bb_pos.x)

                rgb = [color.r, color.g, color.b]
                for i in [0..2]
                    current = @background[i]
                    current = @plain_colors[offset + i] if @plain_colors[offset + i]?

                    rgb[i] = 0.7 * current + 0.3 * rgb[i]

                    @plain_colors[offset + i] = rgb[i]

                    target = rgb[i] * (1 - @noise_impact * (1 - mod))
                    @image_data.data[offset + i] = ~~ target

                _data = $.extend {}, field_brush

                _data.color = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]

                @$emit 'field-changed', {x: x, y: y},
                    x: x
                    y: y
                    field: _data

        confirm_changes: ->
            @_buffer_to_front true

            @unsaved_changes = true
            @$emit 'changes-confirmed'
            @canvas.trigger 'mapchange'

        _buffer_to_front: (with_swap = false)->
            @backbuffer.putImageData @image_data, 0, 0 if with_swap
            @context.save()
            _w = @canvas.width()
            _h = @canvas.height()
            @context.drawImage @backbuffer_canvas[0], 0, 0, @size, @size, 0, 0, _w, _h
            @context.restore()

        _coords_to_backbuffer_pixels: (x, y)->
            offset = {x: @center.x - @size / 2, y: @center.y - @size / 2}
            return {
                x: x - offset.x
                y: y - offset.y
            }