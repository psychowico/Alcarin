namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    class GatewayGroup extends Alcarin.ActiveView
        group_name: @dependencyProperty('group_name', '', (new_name)->
            @group_href new_name.replace(/\s+/g, '-').toLowerCase()
        )
        group_class: @dependencyProperty 'group_class', ''
        group_href : @dependencyProperty 'group_href', ''
        edit_class : @dependencyProperty 'edit_btn_class', ''

        gateways   : @dependencyList '.items'

        edit_group : =>
            @edit_btn.editable('show')
            false

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
            @rel.on 'click', '.edit-group', @edit_group

        disableEdition: ->
            @edit_class 'hide'

        toggle   : (val) ->
            @group_class if val then 'in' else ''

        constructor : (group_name)->
            super()
            @group_name group_name if group_name?

    class Gateway extends Alcarin.ActiveView
        name: @dependencyProperty 'name'
        id  : @dependencyProperty 'id'

        clone : ->
            gateway = new Gateway @name()
            gateway.id @id()
            gateway

        constructor : (_name)->
            super()
            @name _name if _name?

    class exports.Gateways

        constructor : ( $gateways )->
            @groups       = {}
            @$gateways    = $gateways
            @$groups_pane = $gateways.find('.gateways-groups')
            @$edit_pane   = $gateways.find('.gateway-edit')

        create_gateway : =>
            @$groups_pane.fadeOut()
            @$edit_pane.fadeIn()

        cancel_gateway_edit : =>
            @$edit_pane.find('form')._method 'post'

            @$groups_pane.fadeIn()
            @$edit_pane.fadeOut()

        form_submited: (response)=>
            console.log response
            if response.success
                @cancel_gateway_edit()

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

            Rest().$create urls.orbis.gateways, {name: gateway_name, group: group_name}, (response)=>
                new_group = new GatewayGroup group_name
                new_group.gateways().push new Gateway gateway_name

                @groups.push new_group
                @$groups_pane.find('.collapse').collapse 'hide'
                new_group.rel.find("##{group_name}").collapse 'toggle'

        delete_group: (e)=>
            Alcarin.Dialogs.Confirms.admin 'Really deleting? Gateways will be moved to "ungrouped" group.', =>
                uri = urls.orbis.gateways
                $sender = $ e.currentTarget
                group = $sender.closest('.accordion-group').data 'active-view'
                group_name = group.group_name()
                Rest().$delete "#{uri}/#{group_name}", {mode: 'group'}, (response)=>
                    if response.success
                        ungrouped = @groups.list[0]
                        for gateway in group.gateways().iterator()
                            group.gateways().remove gateway
                            ungrouped.gateways().push gateway.clone()
                        @groups.remove group
            false

        init_groups : ->

            #preparing groups active lists
            @groups  = new Alcarin.ActiveList()
            #@groups.setAnim 'slideDown'
            @groups.bind @$groups_pane.find('.active-group')

            #default "ungrouped" group
            ungrouped = new GatewayGroup('Ungrouped')

            @groups.push ungrouped
            @groups.list = { 0: ungrouped }

            ungrouped.toggle true
            ungrouped.disableEdition()

            Rest().$get urls.orbis.gateways, (response)=>
                for group_name, gateways of response.gateways
                    if not @groups.list[group_name]?
                        group = new GatewayGroup group_name
                        @groups.push group
                        @groups.list[group_name] = group

                    group = @groups.list[group_name]
                    for gateway in gateways
                        new_gateway = new Gateway gateway.name
                        new_gateway.id gateway._id.$id
                        group.gateways().push new_gateway

        gateway_click: (e)=>
            $sender  = $(e.currentTarget)
            gateway  = $sender.data 'active-view'

            $form = @$edit_pane.find('form')._method 'put'

            edit_copy = gateway.clone()
            edit_copy.bind @$edit_pane

            @$edit_pane.fadeIn()
            @$groups_pane.fadeOut()

        init : ->
            #register event
            @$groups_pane.on 'click', '.create-gateway', @create_gateway
            @$groups_pane.on 'click', '.add-group', @create_group
            @$groups_pane.on 'click', 'button.close', @delete_group
            @$groups_pane.on 'click', '.items li.gateway', @gateway_click

            #@$edit_pane.on 'click', 'input[type="submit"]', @accept_gateway_edit
            @$edit_pane.on 'click', '.close', @cancel_gateway_edit
            @$edit_pane.find('form').ajaxForm @form_submited

            @init_groups()

