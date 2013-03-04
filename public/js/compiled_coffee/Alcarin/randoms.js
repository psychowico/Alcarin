
namespace('Alcarin', function(exports, Alcarin) {
  return exports.Randoms = (function() {

    function Randoms() {}

    Randoms.index = 0;

    Randoms.id = function() {
      var _index;
      _index = this.index++;
      return "id--" + _index;
    };

    return Randoms;

  })();
});
