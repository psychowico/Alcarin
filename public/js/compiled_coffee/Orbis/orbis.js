var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis', function(exports, Alcarin) {
  return exports.Orbis = (function() {

    function Orbis($orbis) {
      this.load_map_info = __bind(this.load_map_info, this);
      this.orbis = $orbis;
    }

    Orbis.prototype.load_map_info = function() {
      var btn,
        _this = this;
      btn = this.map_info.parent().find('button');
      btn.spin();
      return Rest().$get(function(response) {
        if (response.success) {
          _this.map_info.data('popover').options.content = response.info;
          return btn.spin();
        }
      });
    };

    Orbis.prototype.init = function() {
      var $gateways,
        _this = this;
      $gateways = this.orbis.find('.gateways-list');
      this.gateways = new Alcarin.Orbis.Gateways($gateways);
      this.gateways.init();
      this.map_info = this.orbis.find('.map-info > .info-popover');
      this.map_info.popover({
        html: true,
        trigger: 'manual'
      });
      return this.map_info.parent().find('button').one('mouseover', this.load_map_info).on('click', function() {
        return _this.map_info.popover('toggle');
      });
    };

    return Orbis;

  })();
});
