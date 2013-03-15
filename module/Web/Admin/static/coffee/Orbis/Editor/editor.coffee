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
            state.x = parseInt state.x or 0
            state.y = parseInt state.y or 0
            if state.x != @center?.x or state.y != @center?.y
                @renderer.unsaved_changes = {}
                @center = {
                    x: state.x
                    y: state.y
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
                diff_y = btn.data 'diff-y'

                new_center = $.extend {}, @center

                new_center.x += Math.round step * parseFloat diff_x if diff_x?
                new_center.y += Math.round step * parseFloat diff_y if diff_y?

                $.bbq.pushState {x: new_center.x, y: new_center.y}

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
            map_c = @renderer.canvas.closest '.map-viewport'
            map_c.disable(true).spin true

            @toolbar.save_btn.disable()
            # cast to array, object are bigger (when sending)
            changes = $.map @renderer.changes, (value, key) -> value
            # we sending changes as json coded string, because if we send big
            # number of fields, we will have problems with servers vars count limits
            @proxy.emit 'fields.update', { fields: JSON.stringify changes }

        on_fields_updated: (response)=>
            if response.success
                map_c = @renderer.canvas.closest '.map-viewport'
                map_c.spin(false).enable true, true
                @toolbar.save_btn.closest('.alert').fadeOut()
                @renderer.unsaved_changes = false
                @renderer.changes = {}

        init: ->
            $(window).on('hashchange', @onhashchange)
                     .on 'beforeunload', @on_before_unload

            @renderer.init()

            @proxy.on 'fields.loaded', @on_fields_loaded
            $('.map-viewport .btn').on 'click', @move_btn_click
            @proxy.on 'fields.updated', @on_fields_updated

            @toolbar.init()
            @toolbar.save_btn.click @save_map

