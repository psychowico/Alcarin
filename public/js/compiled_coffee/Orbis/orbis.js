'use strict';

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis', function(exports, Alcarin) {
  angular.module('orbis', ['@popover', '@x-editable', '@gateways', '@minimap-renderer', 'ui.event']).config(function($routeProvider) {
    return $routeProvider.when('/groups/:groupid', {
      controller: Alcarin.Orbis.Gateways.List,
      templateUrl: urls.orbis.panel + '/__gateways-list'
    }).when('/gateway/edit/:gatewayid', {
      controller: Alcarin.Orbis.Gateways.Item,
      templateUrl: urls.orbis.panel + '/__gateway-edit'
    }).when('/gateway/new/:group', {
      controller: Alcarin.Orbis.Gateways.Item,
      templateUrl: urls.orbis.panel + '/__gateway-edit'
    }).otherwise({
      redirectTo: '/groups/0'
    });
  });
  exports.App = ngcontroller([
    '$routeParams', function(params) {
      var _this = this;
      this.$on('$routeChangeSuccess', function() {
        return _this.active_group = params.groupid;
      });
      return this.toggleGroup = function(group) {
        return this.active_group = this.active_group === group.name ? -1 : group.name;
      };
    }
  ]);
  return;
  return exports.Orbis = (function() {

    function Orbis($orbis) {
      this.load_map_info = __bind(this.load_map_info, this);

      this.on_info_loaded = __bind(this.on_info_loaded, this);
      this.orbis = $orbis;
    }

    Orbis.prototype.proxy = function() {
      if (!(this._proxy != null)) {
        this._proxy = new Alcarin.EventProxy(urls.orbis.map);
        this._proxy.on('map-info.generated', this.on_info_loaded);
      }
      return this._proxy;
    };

    Orbis.prototype.on_info_loaded = function(response) {
      this.map_info.data('popover').options.content = response.info;
      return this.map_info.parent().find('.map-info').spin();
    };

    Orbis.prototype.load_map_info = function() {
      var btn;
      btn = this.map_info.parent().find('.map-info');
      btn.spin();
      return this.proxy().emit('get.info');
    };

    /* disabled code, not in use now.
    
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
    */


    Orbis.prototype.init = function() {
      var $gateways,
        _this = this;
      $gateways = this.orbis.find('.gateways-list');
      this.gateways = new Alcarin.Orbis.Gateways.Core($gateways);
      this.gateways.init();
      this.map_info = this.orbis.find('.info-popover');
      this.map_info.popover({
        html: true,
        trigger: 'manual'
      });
      return this.map_info.parent().find('.map-info').one('mouseover', this.load_map_info).on('click', function() {
        return _this.map_info.popover('toggle');
      });
    };

    return Orbis;

  })();
});
