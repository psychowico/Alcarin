
namespace('Alcarin.Orbis', function(exports, Alcarin) {
  return exports.Orbis = (function() {

    function Orbis($orbis) {
      this.$orbis = $orbis;
    }

    Orbis.prototype.init = function() {
      var $gateways;
      $gateways = this.$orbis.find('.gateways-list');
      this.gateways = new Alcarin.Orbis.Gateways($gateways);
      return this.gateways.init();
    };

    return Orbis;

  })();
});
