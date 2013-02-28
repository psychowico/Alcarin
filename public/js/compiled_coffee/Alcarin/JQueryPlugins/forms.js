
namespace('Alcarin.JQueryPlugins', function(exports, Alcarin) {
  $.fn._method = function(method) {
    if (!(method != null)) {
      return this.filter('form').first().find('input[name="_method"]').val().toLowerCase();
    }
    method = method.toUpperCase();
    return this.filter('form').each(function() {
      return $(this).find('input[name="_method"]').val(method);
    });
  };
  return $.fn.disableSelection = function() {
    return this.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
  };
});
