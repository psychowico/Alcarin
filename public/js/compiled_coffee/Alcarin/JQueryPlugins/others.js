
namespace('Alcarin.JQueryPlugins', function(exports, Alcarin) {
  var _old_position;
  $.fn.center = function() {
    var _;
    _ = $(this);
    return {
      left: _.width() / 2,
      top: _.height() / 2
    };
  };
  _old_position = $.fn.position;
  return $.fn.position = function(arg) {
    if ($.isPlainObject(arg)) {
      if (arg.top != null) {
        this.css('top', "" + arg.top + "px");
      }
      if (arg.left != null) {
        this.css('left', "" + arg.left + "px");
      }
      return this;
    }
    return _old_position.call(this);
  };
});
