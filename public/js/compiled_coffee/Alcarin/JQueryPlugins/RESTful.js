/* Extending "Alcarin" namespace with 4 methods: get, insert, put, delete,
that can be useful with RESTful ajax requests.
All method has this same signature:
Alcarin.{methodName}(url, data, dataType)
where data and dataType can be ommited.
By default dataType == 'json'.
*/

namespace('Alcarin.JQueryPlugins', function(exports, Alcarin) {
  var RESTfulInstance, _caller,
    _this = this;
  exports.RESTful = (function() {
    var _ajax, _method,
      _this = this;

    _ajax = null;

    function RESTful() {
      _ajax = jQuery.ajax;
    }

    _method = function(meth) {
      return function(url, data, dataType) {
        var method, settings;
        dataType = dataType || 'json';
        data = $.extend(data || {}, {
          '_method': meth
        });
        method = meth === 'GET' ? 'GET' : 'POST';
        settings = {
          'url': url,
          'data': data,
          'dataType': 'json',
          'type': method
        };
        return _ajax(settings);
      };
    };

    RESTful.prototype.put = _method('PUT');

    RESTful.prototype["delete"] = _method('DELETE');

    RESTful.prototype.post = function(url, data, dataType) {
      var settings;
      settings = {
        'url': url,
        'data': data,
        'dataType': 'json',
        'type': 'POST'
      };
      return _ajax(settings);
    };

    RESTful.prototype.get = function(url, data, dataType) {
      var settings;
      settings = {
        'url': url,
        'data': data,
        'dataType': 'json',
        'type': 'GET'
      };
      return _ajax(settings);
    };

    return RESTful;

  }).call(this);
  RESTfulInstance = new Alcarin.JQueryPlugins.RESTful();
  _caller = function(method) {
    return function(url, data, dataType) {
      return RESTfulInstance[method](url, data, dataType);
    };
  };
  Alcarin.put = _caller('put');
  Alcarin["delete"] = _caller('delete');
  Alcarin.post = _caller('post');
  Alcarin.get = _caller('get');
  return true;
});
