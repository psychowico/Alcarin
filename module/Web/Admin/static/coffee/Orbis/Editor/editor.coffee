namespace 'Alcarin.Orbis.Editor', (exports, Alcarin) ->

    class exports.Editor

        constructor: (@base)->
            @proxy     = new Alcarin.EventProxy urls.orbis.map
            canvas     = @base.find 'canvas'
            @renderer  = new Alcarin.Orbis.Editor.MapRenderer canvas
            @center    = {x: 0, y: 0}
            @step_size = 1

            @toolbar = new Alcarin.Orbis.Editor.Toolbar @base.find('.toolbar'), @renderer

        hashchange: =>
            state = $.bbq.getState()
            if state.x != @center?.x or state.y != @center?.y
                @center = {
                    x: parseInt state.x or 0
                    y: parseInt state.y or 0
                }
                # let redraw map
                @proxy.emit 'fields.fetch', {x: @center.x, y: @center.y}

        move_btn_click: (e)=>
            btn = $ e.currentTarget
            # cauze we want see a fragment of now editing fields
            step = @step_size - 1
            diff_x = btn.data 'diff-x'
            @center.x += step * parseInt(diff_x) if diff_x?
            diff_y = btn.data 'diff-y'
            @center.y += step * parseInt(diff_y) if diff_y?

            $.bbq.pushState {x: @center.x, y: @center.y}

        on_fields_loaded: (response)=>
            if response.success
                @step_size = response.size
                @renderer.set_center @center.x, @center.y
                @renderer.redraw response.size, response.fields

        init: ->
            @renderer.init()
            @proxy.on 'fields.loaded', @on_fields_loaded
            $('.map-viewport .btn').on 'click', @move_btn_click
            $(window).on 'hashchange', @hashchange

            @toolbar.init()

