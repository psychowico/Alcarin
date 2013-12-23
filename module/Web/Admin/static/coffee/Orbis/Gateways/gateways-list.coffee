'use-strict'

namespace 'Alcarin.Orbis.Gateways', (exports, Alcarin) ->

    exports.List = ngcontroller ['GatewaysGroup', 'Gateway', '@EventsBus',
        (GatewaysGroup, Gateway, EventsBus)->
            @gateways_groups = GatewaysGroup.query {full: true}

            @rename = (_group)=>
                (ign, new_name)=>
                    return "Can not be empty." if not new_name
                    return "Group name reserved." if new_name in (group.name for group in @gateways_groups)
                    group.name = new_name
                    group.$save => @$emit 'groupChanged', new_name

            @hoverGateway = (gateway)=>
                EventsBus.emit 'mouse-enter-gateway', gateway.loc.x, gateway.loc.y
            @leaveGateway = (gateway)=>
                EventsBus.emit 'mouse-leave-gateway'

            @deleteGateway = (group, gateway)=>
                Alcarin.Dialogs.Confirms.admin 'Really deleting this gateway?', =>
                    Gateway.get {id: gateway.id}, ($gateway)=>
                        $gateway.$delete =>
                            group.gateways.remove gateway
                            @gateways_groups.remove group if group.gateways.length == 0 and group.id != '0'
            @deleteGroup = (group)=>
                Alcarin.Dialogs.Confirms.admin 'Really deleting? Gateways will be moved to "ungrouped" group.', =>
                    c_group = new GatewaysGroup group
                    group.$delete =>
                        #reload group when delete one
                        @gateways_groups.remove group
                        @gateways_groups[0].gateways.push _g for _g in c_group.gateways
                        @$emit 'groupChanged', 0

            @createGroup = =>
                group = new GatewaysGroup()
                group.name = 'new_group ...'
                group.id   = 'new_group'
                group.$create =>
                    @gateways_groups.push group
                    @$emit 'groupChanged', group.name

            @leaveGateway()
    ]

    exports.Item = ngcontroller ['GatewaysGroup', 'Gateway', '$routeParams',
            '$location', '@EventsBus',
        (GatewaysGroup, Gateway, $params, $loc, EventsBus)->
            @groups = GatewaysGroup.query()
            @title  = '...'
            mode    = if $params.gatewayid? then 'edit' else 'create'

            @cancel = =>
                @$emit 'groupChanged', @rel.group
                $loc.path '/groups'

            switch mode
                when 'edit'
                    @title = 'Edit gateway'
                    Gateway.get {id: $params.gatewayid}, (_gateway)=>
                        @rel = _gateway
                        EventsBus.emit 'mouse-enter-gateway', _gateway.loc.x, _gateway.loc.y
                    @save = ()->
                        @rel.$save {}, @cancel
                when 'create'
                    @title = 'New gateway'
                    @rel = $.extend new Gateway(),
                        name: 'newGateway'
                        group: $params.group
                        description: 'new gateway..'
                        loc:
                            x: 0
                            y: 0
                    @save = ()->
                        @rel.$create {}, @cancel

            EventsBus.on 'flag.updated', (x, y)=>
                @rel?.loc.x = x
                @rel?.loc.y = y
    ]
