namespace('Alcarin.Dialogs', function(exports, Alcarin) {
  return exports.Confirms = (function() {
    function Confirms() {}

    Confirms.admin = function(query, onconfirm, onreject) {
      var result;

      result = confirm(query);
      if (result && (onconfirm != null)) {
        onconfirm();
      } else if (!result && (onreject != null)) {
        onreject();
      }
      return result;
    };

    return Confirms;

  })();
});

/*
//@ sourceMappingURL=confirms.js.map
*/
