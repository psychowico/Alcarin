var __slice = [].slice;

namespace('Alcarin.Errors', function(exports, Alcarin) {
  var cookie_name, day_limit, space;

  cookie_name = 'js-errors';
  /*errors nb will be stored in cookie and requests will be blocked when
  number reach this limit
  */

  day_limit = 5;
  this.onerror = function(msg, url, line) {
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
    url = url.split('/').slice(3).join('/');
    data = {
      'msg': msg,
      'url': url,
      'line': line
    };
    $.cookie.raw = false;
    return false;
  };
  space = function() {
    var _console;

    _console = window.console || {
      debug: function() {},
      log: function() {},
      info: function() {},
      warn: function() {},
      error: function() {}
    };
    _console._error = _console.error;
    _console.error = function() {
      var caller_stack, data, msg, _i, _len, _msg, _results;

      _msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      msg = _msg[0];
      caller_stack = printStackTrace()[4];
      data = {
        mode: 'manual',
        stack: caller_stack,
        msg: msg
      };
      _results = [];
      for (_i = 0, _len = _msg.length; _i < _len; _i++) {
        msg = _msg[_i];
        _results.push(this._error(msg));
      }
      return _results;
    };
    return window.console = _console;
  };
  return space();
});

/*
//@ sourceMappingURL=errors-core.js.map
*/
