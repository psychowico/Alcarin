namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    class GatewayGroup extends Alcarin.ActiveView
        group_name: @dependencyProperty('group_name', '', (new_name)->
            @group_href new_name.replace(/\s+/g, '-').toLowerCase()
        )
        group_class: @dependencyProperty 'group_class', ''
        group_href : @dependencyProperty 'group_href', ''
        edit_class : @dependencyProperty 'edit_btn_class', ''
        id         : @dependencyProperty 'id', 1

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
        name: @dependencyProperty('name')

        constructor : (_name)->
            super()
            @name _name if _name?

    class exports.Gateways

        constructor : ( $gateways )->
            @groups = {}
            @$gateways = $gateways
            @$groups_pane   = $gateways.find('.gateways-groups')
            @$edit_pane = $gateways.find('.gateway-edit')

        create_gateway : =>
            @$groups_pane.fadeOut()
            @$edit_pane.fadeIn()

        cancel_gateway_edit : =>
            @$groups_pane.fadeIn()
            @$edit_pane.fadeOut()

        create_group : =>
            new_group = new GatewayGroup('New_group')
            #new_group.group_href 'pustak'
            @groups.push new_group

        init : ->
            #register event
            @$groups_pane.on 'click', '.create-gateway', @create_gateway
            @$groups_pane.on 'click', '.add-group', @create_group
            @$edit_pane.on 'click', '.close', @cancel_gateway_edit

            #preparing groups active lists
            @groups  = new Alcarin.ActiveList()
            @groups.setAnim 'slideDown'
            @groups.bind @$groups_pane.find('.active-group')

            #default "ungrouped" group
            ungrouped = new GatewayGroup('Ungrouped')

            @groups.ungrouped
            @groups.push ungrouped

            ungrouped.toggle true
            ungrouped.disableEdition()

            Alcarin.get('/admin/orbis').done (response)->
                un_result = (new Gateway(obj.name) for obj in response.gateways[0]) if response.gateways[0]
                ungrouped.gateways().concat un_result

