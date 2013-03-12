var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis', function(exports, Alcarin) {
  return exports.Orbis = (function() {

    function Orbis($orbis) {
      this.init_radius_modal = __bind(this.init_radius_modal, this);

      this.radius_real_time_change = __bind(this.radius_real_time_change, this);

      this.change_radius = __bind(this.change_radius, this);

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

    Orbis.prototype.change_radius = function(e) {
      this.radius_form.submit();
      return false;
    };

    Orbis.prototype.radius_real_time_change = function(e) {
      var $help, $sender, val;
      $sender = $(e.currentTarget);
      val = $sender.val() / 10;
      $help = $sender.parent().find('.help-inline');
      if (isNaN(val)) {
        $help.text('Wrong value!');
        return $sender.closest('.control-group').addClass('error');
      } else {
        this.proxy().emit('get.info', {
          radius: val
        });
        $sender.closest('.control-group').removeClass('error');
        return $help.text("" + val + "km");
      }
    };

    Orbis.prototype.init_radius_modal = function() {
      var $radius_info, $radius_modal, radius_field,
        _this = this;
      this.radius_form = $('#radius-form');
      radius_field = this.radius_form.find('[name="radius"]');
      radius_field.on('keyup change', this.radius_real_time_change);
      $radius_modal = $('#change-radius-modal');
      $radius_modal.on('success', this.change_radius).on('show', function() {
        _this.radius_form.reset();
        return radius_field.trigger('change');
      });
      this.help_text = radius_field.parent().find('.help-inline');
      $radius_info = $radius_modal.find('.radius-info-container');
      return this.proxy().on('tmp-map-info.generated', function(response) {
        return $radius_info.html(response.info);
      });
    };

    Orbis.prototype.init = function() {
      var $gateways,
        _this = this;
      $gateways = this.orbis.find('.gateways-list');
      this.gateways = new Alcarin.Orbis.Gateways($gateways);
      this.gateways.init();
      this.init_radius_modal();
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
