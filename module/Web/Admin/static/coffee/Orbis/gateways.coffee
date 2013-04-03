namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    root = null

    class exports.Gateways

        constructor : ($gateways)->
            @groups       = {}
            @$gateways    = $gateways
            @$groups_pane = $gateways.find('.gateways-groups')
            @$edit_pane   = $gateways.find('.gateway-edit')
            @$edit_pane_form = @$edit_pane.find('form')
            @proxy = new Alcarin.EventProxy urls.orbis.gateways

        minimap: ->
            if not @_minimap
                @_minimap    = $('.minimap > canvas').data 'minimap'
            @_minimap

        gateway_editor: ->
            if not @editor?
                @editor = new GatewayEditor @$edit_pane, @$groups_pane
            @editor

        create_group : =>

            name  = 'new_group_'
            index = 0
            index++ while @groups.list["#{name}#{index}"]?

            group_name = "#{name}#{index}"
            gateway_name = 'Empty Gateway'

            data = {
                creating_group: true,
                name : gateway_name,
                group: group_name,
                description: 'Please, add description to this gateway!',
                x: 0, y: 0,
            }

            @proxy.emit 'group.create', data

        on_group_created: (response)=>
            if response.success
                new_group = new GatewayGroup response.gateway.group

                new_gateway = new Gateway
                new_gateway.copy response.gateway

                new_group.rel.find("##{response.name}").collapse 'toggle'

        on_reload_gateways: (response)=>
            # fixing php/json communication problem. when we send object {0: 'something'}
            # we goting array instead of object
            response.gateways = {0: response.gateways[0]} if $.isArray response.gateways
            for group_name, gateways of response.gateways
                if not @groups.list[group_name]?
                    group = new GatewayGroup group_name
                    @groups.list[group_name] = group
                for gateway in gateways
                    new_gateway = new Gateway
                    new_gateway.copy gateway

        on_group_deleted: (response)=>
            if response.success
                name = response.id
                if @groups.list[name]?
                    group = @groups.list[name]
                    gateway.group 0 for gateway in group.gateways().iterator()

        on_gateway_deleted: (response)=>
            if response.success
                gg = @groups.list[response.group]
                gg.remove_by_id response.id
                @groups.remove gg if gg.gateways().length() == 0 and gg.editable

        init_groups : ->

            #preparing groups active lists
            @groups = groups = new Alcarin.ActiveList()
            groups.list = {}
            groups.setAnims 'slideDown', 'slideUp'

            $list = @$groups_pane.parent().find('.active-group')

            groups.bind $list

            #default "ungrouped" group
            ungrouped = new GatewayGroup 'Ungrouped'
            groups.list[0] = ungrouped

            ungrouped.toggle true
            ungrouped.disable_edition()

            # let fetch all gateways
            @proxy.emit 'gateways.fetch'

        init : ->
            #register event
            root = @
            @$groups_pane.on 'click', '.add-group', @create_group

            # fix problem with google chrome, not deleting this.
            $('[name="description"]').attr('value', '{item.description}')

            @proxy.on 'gateways.all', @on_reload_gateways
            @proxy.on 'group.created', @on_group_created
            @proxy.on 'group.deleted', @on_group_deleted
            @proxy.on 'gateway.deleted', @on_gateway_deleted
            #@proxy.on 'gateway.created', @on_gateway_created

            @init_groups()

    class GatewayGroup extends Alcarin.ActiveView

        group_name: (name)->
            name = 'Ungrouped' if name == 0
            @group_name_dep name

        group_name_dep : @dependencyProperty('group_name', '', (old_name, new_name)->
            # when group name is changed we need update global groups object
            root.groups.list[new_name] = @

            if @initialized
                gateway.group new_name for gateway in @gateways().iterator()

            if root.groups.list[old_name]?
                delete root.groups.list[old_name]

            @debug = new_name
        )

        edit_class : @dependencyProperty 'edit_btn_class', ''
        group_class: @dependencyProperty 'group_class', ''
        css_id     : @dependencyProperty 'css_id'

        gateways   : @dependencyList '.items'

        constructor : (group_name)->
            @debug = ''
            @editable = true
            super()
            @css_id Alcarin.Randoms.id()
            @group_name group_name if group_name?

            root.groups.list[group_name] = @
            root.groups.push @

            @gateways().setAnims 'slideDown', 'slideUp'

        remove_by_id: (id)=>
            for gateway in @gateways().iterator()
                if gateway.id() == id
                    @gateways().remove gateway
                    break

        onbind : ($target)->
            super()
            edit_btn = $target.find '.group-name.editable'
            if edit_btn.length > 0
                @edit_btn = edit_btn
                @edit_btn.editable({
                    success: @edit_group,
                    validate: (val)-> 'Forbidden group name.' if val == 'Ungrouped'
                })
                .on('shown', (e)=>
                    $input = $(e.currentTarget).data('editable').input.$input
                    $input?.val @group_name()
                )
                $target.on 'click', '.edit-group', =>
                    @edit_btn.editable('option', {url: urls.orbis.gateways + '/' + @group_name() })
                    @edit_btn.editable('show')
                    false

            $target.on 'click', '.create-gateway', @create_gateway
            $target.on 'click', 'button.close.delete-group', @delete_group

        edit_group: (response, value) =>
            if response.success
                @group_name value
                #to stop auto-update
                return {newValue: undefined}
            if response.error? then response.error else 'Error occured.'

        disable_edition: ->
            @edit_class 'hide'
            @editable = false

        toggle: (val) ->
            @group_class if val then 'in' else ''

        create_gateway: (e)=>
            edition_gateway  = new Gateway false

            edition_gateway.name('Empty gateway').group(@group_name())
               .description 'Please, add description to this gateway!',

            editor = root.gateway_editor()
            editor.show edition_gateway, 'gateway.create', 'gateway.created', (response)=>
                gateway = new Gateway
                gateway.copy response.gateway

        delete_group: ()=>
            Alcarin.Dialogs.Confirms.admin 'Really deleting? Gateways will be moved to "ungrouped" group.', =>
                group_name = @group_name()
                root.proxy.emit 'group.delete', {id: group_name}
            false

    class Gateway extends Alcarin.ActiveView
        id         : @dependencyProperty 'id'
        name       : @dependencyProperty('name', '', (o, val) => @debug = val)

        description: @dependencyProperty 'description', ' '
        x          : @dependencyProperty 'x', '0'
        y          : @dependencyProperty 'y', '0'

        group      : (group_name)->
            # group 0 mean ungrouped always
            group_name = 'Ungrouped' if group_name == 0
            @group_dep group_name

        group_dep  : @dependencyProperty('group', '', (old_name, new_name)->
            # when group string is changed we find old GatewayGroup object and remove
            # this Gateway from it. next we add this Gateway to new GatewayGroup
            if @auto_bind
                target_group = root.groups.list[new_name]
                old_group    = root.groups.list[old_name]
                if old_group != target_group
                    old_group?.gateways().remove @
                    if old_group?.gateways().length() == 0 and old_group?.editable
                        root.groups.remove old_group
                    target_group?.gateways().push @
        )

        gateway_group: ->
            root.groups.list[@group()]

        edit: =>
            edit_copy = @clone()

            editor = root.gateway_editor()
            editor.show edit_copy, 'gateway.update', 'gateway.updated', (response)=>
                @copy response.gateway
            false

        delete: =>
            Alcarin.Dialogs.Confirms.admin 'Really deleting this gateway?', =>
                root.proxy.emit 'gateway.delete', {id: @id(), group: @group()}

        mouse_enter: =>
            if not @tmp_flag?
                @tmp_flag = root.minimap().create_flag @x(), @y()
                @tmp_flag.show()

        mouse_leave: =>
            @tmp_flag?.destroy()
            delete @tmp_flag

        onbind: ($target)->
            $target.on('click', 'a.edit', @edit)
                   .on('click', '.delete-gateway', @delete)

            $target.filter('li')
                   .on('mouseenter', @mouse_enter)
                   .on('mouseleave', @mouse_leave)

        onunbind: ($target)->
            $target.off('click', 'a', @edit)
                   .off('click', '.delete-gateway', @delete)
                   .off('mouseenter', @mouse_enter)
                   .off('mouseleave', @mouse_leave)
            @tmp_flag?.destroy()

        constructor : (@auto_bind = true)->
            @debug = ''
            super()

    class GatewayEditor

        constructor: (@edit_pane, @groups_pane)->
            @form = @edit_pane.find('form').alcForm()
            @form.enable_proxy root.proxy
            @form.on_success @on_success

            @edit_pane.on 'click', '.close', @cancel
            @minimap = root.minimap()

            @flag_mode = false

        flag_drop: (drop_event)=>
            p      = drop_event.position
            coords = @minimap.to_coords p.left, p.top
            @gateway.x coords.x
            @gateway.y coords.y

        on_success: (response)=>
            @callback? response
            @cancel()

        edit_flag_mode: (val)->
            if not @flag_mode and val
                @flag = @minimap.create_flag @gateway.x(), @gateway.y()
                @flag.drop @flag_drop
                @flag.show()
                @flag_mode = true
            else if @flag_mode and not val
                @flag?.release_drop()
                @flag.destroy()
                delete @flag
                @flag_mode = false

        show: (gateway, _emit_order, _response_event, callback)->

            @gateway  = gateway
            @callback = callback

            gateway.bind @edit_pane
            @edit_flag_mode true

            @form.base.find('[name="group"]').val gateway.group()
            @form.set_emit_order _emit_order
            @form.set_response_event _response_event

            @groups_pane.fadeOut()
            @edit_pane.fadeIn()

        cancel: =>
            @edit_flag_mode false

            @groups_pane.fadeIn()
            @edit_pane.fadeOut =>
                @gateway.unbind @edit_pane
                @gateway = null
                @form.reset()