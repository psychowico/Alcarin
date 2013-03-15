namespace 'Alcarin.Orbis.Editor', (exports, Alcarin) ->

    class exports.Toolbar

        Current: {
            color: { r: 0, g: 128, b:0 }
        }

        constructor: (@base, @renderer)->
            @brush_size = 1

        canvas_mouse_down: (e)=>
            @renderer.canvas.on 'mousemove', @canvas_mouse_painting
            # @renderer.begin_line e.offsetX, e.offsetY, @Current.color
            @canvas_mouse_painting(e)

        canvas_mouse_up: =>
            @renderer.canvas.off 'mousemove', @canvas_mouse_painting

        canvas_mouse_painting: (e)=>
            coords = @renderer.pixels_to_coords e.offsetX, e.offsetY
            if @brush_size > 1
                range   = @brush_size - 1
                range_2 = range * range
                for oy in [-range..range]
                    for ox in [-range..range]
                        if oy * oy + ox * ox <= range_2
                            @renderer.put_field coords.x + ox, coords.y + oy, @Current
            else
                @renderer.put_field coords.x, coords.y, @Current

            @renderer.confirm_changes()


        map_change: =>
            @base.find('.alert').fadeIn()

        size_changed: (e, ui)=>
            @brush_size = ui.value

        onhashchange: =>
            state = $.bbq.get()
            if state.color?
                @Current.color = Alcarin.Color.hexToRGB state.color
                @color_picker.css 'background-color', state.color

        init: ->
            @base.find('.alert .close').click -> $(@).parent().fadeOut()
            @base.find('.slider').slider {
                min: 1
                max: 10
                value: 1
                slide: @size_changed
            }
            @save_btn = @base.find('.alert .btn')

            @renderer.canvas.on('mousedown', @canvas_mouse_down)
                            .on('mouseup', @canvas_mouse_up)
                            .on('mapchange', @map_change)
            @color_picker = @base.find('a.color-picker')
            @color_picker.colorpicker()
                .on 'hide', (e)=> $.bbq.push {'color': e.color.toHex()}

            $(window).hashchange @onhashchange