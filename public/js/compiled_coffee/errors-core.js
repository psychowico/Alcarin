
namespace('Alcarin.JQueryPlugins', function(exports, Alcarin) {
  var cookie_name, day_limit;
  cookie_name = 'js-errors';
  /*errors nb will be stored in cookie and requests will be blocked when
  number reach this limit
  */

  day_limit = 5;
  return this.onerror = function(msg, url, line) {
    var cookie, data;
    $.cookie.raw = true;
    cookie = $.cookie(cookie_name);
    if (!cookie) {
      cookie = 0;
      $.cookie(cookie_name, cookie, {
        expires: 1
      });
    } else {
      cookie = parseInt(cookie);
      if (cookie >= day_limit) {
        return false;
      }
      $.cookie(cookie_name, cookie + 1, {
        expires: 1
      });
    }
    if (_.post) {
      data = {
        'msg': msg,
        'url': url,
        'line': line
      };
      _.post('/api/errors/external', data);
    }
    $.cookie.raw = false;
    return false;
  };
});
