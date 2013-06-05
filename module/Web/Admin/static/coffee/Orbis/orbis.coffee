'use strict'

namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    angular.module('orbis', ['alc-popover', 'alc-x-editable', 'alc-gateways'])
           .config ($routeProvider)->
                $routeProvider
                    .when '/groups/:groupid',
                        controller: Alcarin.Orbis.Gateways.List
                        templateUrl: urls.orbis.panel + '/__gateways-list'
                    .when '/gateway/edit/:gatewayid',
                        controller: Alcarin.Orbis.Gateways.Item
                        templateUrl: urls.orbis.panel + '/__gateway-edit'
                    .when '/gateway/new/:group',
                        controller: Alcarin.Orbis.Gateways.Item
                        templateUrl: urls.orbis.panel + '/__gateway-edit'
                    .otherwise
                        redirectTo:'/groups/0'

                # when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).

    exports.App = ngcontroller ['$routeParams', (params)->
        @$on '$routeChangeSuccess', =>
            @active_group = params.groupid

        @toggleGroup = (group)->
            @active_group = if @active_group == group.name then -1 else group.name
    ]
        # init : ->

        #     # @init_radius_modal()

        #     @map_info = @orbis.find '.info-popover'
        #     @map_info.popover {html: true, trigger: 'manual'}
        #     @map_info.parent().find('.map-info').one('mouseover', @load_map_info)
        #                             .on 'click', => @map_info.popover 'toggle'

    return

    class exports.Orbis

        constructor : ($orbis)->
            @orbis    = $orbis

        proxy: ->
            if not @_proxy?
                @_proxy = new Alcarin.EventProxy urls.orbis.map
                @_proxy.on 'map-info.generated', @on_info_loaded
            @_proxy

        on_info_loaded: (response)=>
            @map_info.data('popover').options.content = response.info
            @map_info.parent().find('.map-info').spin()

        load_map_info: =>
            btn = @map_info.parent().find('.map-info')
            btn.spin()

            @proxy().emit 'get.info'

        ### disabled code, not in use now.

        change_radius: (e)=>
            @radius_form.submit()
            false

        radius_real_time_change: (e)=>

            $sender = $(e.currentTarget)
            val = $sender.val() / 10

            $help = $sender.parent().find('.help-inline')
            if isNaN val
                $help.text 'Wrong value!'
                $sender.closest('.control-group').addClass 'error'
            else
                # we match map information on server to avoid redundant code
                @proxy().emit 'get.info', {radius: val}
                $sender.closest('.control-group').removeClass 'error'
                $help.text "#{val}km"

        init_radius_modal: =>

            @radius_form = $ '#radius-form'
            radius_field = @radius_form.find('[name="radius"]')
            radius_field.on 'keyup change', @radius_real_time_change

            $radius_modal = $('#change-radius-modal')
            $radius_modal.on('success', @change_radius)
                         .on 'show', =>
                            @radius_form.reset()
                            radius_field.trigger 'change'


            @help_text = radius_field.parent().find('.help-inline')

            $radius_info = $radius_modal.find '.radius-info-container'
            @proxy().on 'tmp-map-info.generated', (response)=>
                $radius_info.html response.info

        ###

        init : ->
            $gateways = @orbis.find '.gateways-list'

            @gateways = new Alcarin.Orbis.Gateways.Core $gateways
            @gateways.init()

            # @init_radius_modal()

            @map_info = @orbis.find '.info-popover'
            @map_info.popover {html: true, trigger: 'manual'}
            @map_info.parent().find('.map-info').one('mouseover', @load_map_info)
                                    .on 'click', => @map_info.popover 'toggle'
