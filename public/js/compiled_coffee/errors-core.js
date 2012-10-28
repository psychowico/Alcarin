
namespace('Alcarin.JQueryPlugins', function(exports, Alcarin) {
  var _this = this;
  return this.onerror = function(msg, url, line) {
    var data;
    if (_.post) {
      data = {
        'msg': msg,
        'url': url,
        'line': line
      };
      _.post('/api/errors/external', data);
      return true;
    }
    return false;
  };
});
