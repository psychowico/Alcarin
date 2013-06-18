var __slice = [].slice;

namespace('Alcarin', function(exports, Alcarin) {
  return exports.Path = (function() {
    function Path() {}

    Path.combine = function() {
      var arg, last, part, path, _arg, _i, _len;

      arg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      path = '';
      for (_i = 0, _len = arg.length; _i < _len; _i++) {
        part = arg[_i];
        _arg = part.toString().replace('\\', '/');
        if (_arg[0] === '/') {
          _arg = _arg.slice(1);
        }
        last = path.slice(-1, 1);
        if (last !== '/') {
          path += '/';
        }
        path += _arg;
      }
      if (arg[0].indexOf('http://' === 0 || arg[0].indexOf('https://' === 0))) {
        path = path.slice(1);
      }
      return path;
    };

    return Path;

  })();
});

/*
//@ sourceMappingURL=path.js.map
*/
