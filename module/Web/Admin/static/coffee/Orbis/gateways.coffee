namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    class GatewayGroup extends Alcarin.ActiveView
        group_name: @dependencyProperty('group_name', '', (new_name)->
            @group_href new_name.replace(/\s+/g, '-').toLowerCase()
        )
        group_class: @dependencyProperty 'group_class', ''
        group_href : @dependencyProperty 'group_href', ''
        edit_class : @dependencyProperty 'edit_btn_class', ''

        gateways   : @dependencyList '.items'

        constructor : (@parent, group_name)->
            super()
            @group_name group_name if group_name?

        init : ->
            super()
            @gateways()
            @edit_btn = @rel.find '.group-name.editable'
            @edit_btn.editable({
                success: (response, value) =>
                    if response.success
                        @group_name value
                        #to stop auto-update
                        return {newValue: undefined}
                    if response.error? then response.error else 'Error occured.'
            }).on('shown', (e)=>
                $input = $(e.currentTarget).data('editable').input.$input
                $input?.val @group_name()
            )
            @rel.on 'click', '.create-gateway', @create_gateway
            @rel.on 'click', '.edit-group', @edit_group
            @rel.on 'click', 'button.close.delete-group', @delete_group

        edit_group : =>
            @edit_btn.editable('show')
            false

        disable_edition: ->
            @edit_class 'hide'

        toggle: (val) ->
            @group_class if val then 'in' else ''

        create_gateway: (e)=>

            edition_gateway  = new Gateway undefined, 'new_gateway'
            edition_gateway.bind @parent.$edit_pane
            edition_gateway.group @group_name()

            $form = @parent.$edit_pane_form
            $form._method 'post'

            $form.one 'ajax-submit', (e, response)=>
                if response.success
                    gateway = new Gateway @
                    gateway.copy(response.data)

                    @parent.cancel_gateway_edit()

            @parent.$edit_pane.fadeIn()
            @parent.$groups_pane.fadeOut()

            false

        delete_group: ()=>
            Alcarin.Dialogs.Confirms.admin 'Really deleting? Gateways will be moved to "ungrouped" group.', =>
                uri = urls.orbis.gateways
                group_name = @group_name()
                Rest().$delete "#{uri}/#{group_name}", {mode: 'group'}, (response)=>
                    if response.success
                        ungrouped = @parent.groups.list[0].gateways()
                        ungrouped.push gateway.clone() for gateway in @gateways().iterator()
                        @gateways().clear()
                        @parent.groups.remove @
            false

    class Gateway extends Alcarin.ActiveView
        id         : @dependencyProperty 'id'
        name       : @dependencyProperty 'name'
        description: @dependencyProperty 'description', ' '
        x          : @dependencyProperty 'x', '0'
        y          : @dependencyProperty 'y', '0'
        group      : @dependencyProperty 'group', '0'

        edit: =>
            $form = @parent.parent.$edit_pane_form
            $form._method 'put'

            edit_copy = @clone()
            edit_copy.bind @parent.parent.$edit_pane

            $form.one 'ajax-submit', (e, response)=>
                if response.success
                    @copy response.data
                    @parent.parent.cancel_gateway_edit()

            @parent.parent.$edit_pane.fadeIn()
            @parent.parent.$groups_pane.fadeOut()
            false

        delete: =>
            Alcarin.Dialogs.Confirms.admin 'Really deleting this gateway?', =>
                uri = urls.orbis.gateways
                id  = @id()
                Rest().$delete "#{uri}/#{id}", {mode: 'gateway'}, (response)=>
                    if response.success
                        @parent.gateways().remove @

        init: ->
            super()
            if @parent?
                group = @parent.group_name()
                if group == 'Ungrouped'
                    group = 0
                @group group
                @rel.on 'click', 'a', @edit
                @rel.on 'click', '.close', @delete

        constructor : (@parent, _name)->
            super()
            @name _name if _name?
            @parent?.gateways().push @

    class exports.Gateways

        constructor : ( $gateways )->
            @groups       = {}
            @$gateways    = $gateways
            @$groups_pane = $gateways.find('.gateways-groups')
            @$edit_pane   = $gateways.find('.gateway-edit')
            @$edit_pane_form = @$edit_pane.find('form')

        cancel_gateway_edit : =>
            @$groups_pane.fadeIn()
            @$edit_pane.fadeOut()
            @$edit_pane_form.unbind 'ajax-submit'

        create_group : =>

            get_group_name = ()=>
                name  = 'new_group_'
                index = 0
                exists = (_name)=>
                    for group in @groups.iterator()
                        if group.group_name() is _name
                            return true
                    false

                index++ while exists "#{name}#{index}"
                "#{name}#{index}"

            group_name = get_group_name()
            gateway_name = 'Empty Gateway'

            data = {
                creating_group: true,
                name : gateway_name,
                group: group_name,
                description: 'Please, add description to this gateway!',
                x: 0, y: 0,
            }

            Rest().$create urls.orbis.gateways, data, (response)=>
                if response.success
                    new_group = new GatewayGroup @, group_name

                    new_gateway = new Gateway new_group
                    new_gateway.copy response.data

                    @groups.push new_group
                    @$groups_pane.find('.collapse').collapse 'hide'
                    new_group.rel.find("##{group_name}").collapse 'toggle'

        init_groups : ->

            #preparing groups active lists
            @groups  = new Alcarin.ActiveList()
            #@groups.setAnim 'slideDown'
            @groups.bind @$groups_pane.find('.active-group')

            #default "ungrouped" group
            ungrouped = new GatewayGroup @, 'Ungrouped'

            @groups.push ungrouped
            @groups.list = { 0: ungrouped }

            ungrouped.toggle true
            ungrouped.disable_edition()

            Rest().$get urls.orbis.gateways, (response)=>
                for group_name, gateways of response.gateways
                    if not @groups.list[group_name]?
                        group = new GatewayGroup @, group_name
                        @groups.push group
                        @groups.list[group_name] = group
                    group = @groups.list[group_name]
                    for gateway in gateways
                        new_gateway = new Gateway group
                        new_gateway.copy gateway

        init : ->
            #register event
            @$groups_pane.on 'click', '.add-group', @create_group
            @$edit_pane.on 'click', '.close', @cancel_gateway_edit
            # fix problem with google chrome, not deleting this.
            $('[name="description"]').attr('value', '{item.description}')

            @init_groups()

