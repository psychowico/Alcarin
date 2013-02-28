
namespace('Alcarin.Dialogs', function(exports, Alcarin) {
  return exports.Confirms = (function() {

    function Confirms() {}

    Confirms.admin = function(query, onconfirm, onreject) {
      var result;
      result = confirm(query);
      if (result && (onconfirm != null)) {
        return onconfirm();
      } else if (!result && (onreject != null)) {
        return onreject();
      }
    };

    return Confirms;

  })();
});
