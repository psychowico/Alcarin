
namespace('Alcarin.JQueryPlugins', function(exports, Alcarin) {
  return $.fn._method = function(method) {
    method = method.toUpperCase();
    return this.filter('form').each(function() {
      return $(this).find('input[name="_method"]').val(method);
    });
  };
});
