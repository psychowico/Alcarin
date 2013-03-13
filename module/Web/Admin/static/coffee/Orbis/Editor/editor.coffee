namespace 'Alcarin.Orbis.Editor', (exports, Alcarin) ->

    class exports.Editor

        constructor: (@base)->
            @proxy     = new Alcarin.EventProxy urls.orbis.map
            canvas     = @base.find 'canvas'
            @renderer  = new Alcarin.Orbis.Editor.MapManager canvas
            @step_size = 1

            @toolbar = new Alcarin.Orbis.Editor.Toolbar @base.find('.toolbar'), @renderer

        onhashchange: =>
            state = $.bbq.getState()
            state.x = state.x or 0
            state.y = state.y or 0

            if state.x != @center?.x or state.y != @center?.y
                @center = {
                    x: parseInt state.x
                    y: parseInt state.y
                }
                # let redraw map
                @renderer.canvas.parent().spin true
                @proxy.emit 'fields.fetch', {x: @center.x, y: @center.y}

            false

        move_btn_click: (e)=>
            btn_click = =>
                btn = $ e.currentTarget
                # cauze we want see a fragment of now editing fields
                step = @step_size - 1
                diff_x = btn.data 'diff-x'
                @center.x += step * parseInt(diff_x) if diff_x?
                diff_y = btn.data 'diff-y'
                @center.y += step * parseInt(diff_y) if diff_y?

                $.bbq.pushState {x: @center.x, y: @center.y}

            if @renderer.unsaved_changes
                Alcarin.Dialogs.Confirms.admin 'You will lost all unsaved changes. Are you sure you want to continue?', =>
                    btn_click()
            else
                btn_click()

            false

        on_before_unload: =>
            'You lost your unsaved changes! You are sure?' if @renderer.unsaved_changes

        on_fields_loaded: (response)=>
            @renderer.canvas.parent().spin false
            if response.success
                @step_size = response.size
                @renderer.set_center @center.x, @center.y
                @renderer.redraw response.size, response.fields

        save_map: (e)=>
            changes = @renderer.changes
            @renderer.changes = {}
            @toolbar.save_btn.spin()
            @proxy.emit 'fields.update', {fields: changes}

        on_fields_updated: (response)=>
            if response.success
                @toolbar.save_btn.spin()
                @toolbar.save_btn.closest('.alert').fadeOut()
                @renderer.unsaved_changes = false

        init: ->
            @renderer.init()

            @proxy.on 'fields.loaded', @on_fields_loaded
            $('.map-viewport .btn').on 'click', @move_btn_click
            @proxy.on 'fields.updated', @on_fields_updated

            $(window).on('hashchange', @onhashchange)
                     .on 'beforeunload', @on_before_unload

            @toolbar.init()
            @toolbar.save_btn.click @save_map

