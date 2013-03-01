/* Extending "Alcarin" namespace with 4 methods: get, insert, put, delete,
that can be useful with RESTful ajax requests.
All method has this same signature:
Alcarin.{methodName}(url, data, dataType)
where data and dataType can be ommited.
By default dataType == 'json'.
*/

namespace('Alcarin.JQueryPlugins', function(exports, Alcarin) {
  exports.RESTful = (function() {
    var _ajax, _method,
      _this = this;

    _ajax = null;

    function RESTful() {
      _ajax = jQuery.ajax;
    }

    RESTful.getInstance = function() {
      if (!(exports.RESTful.instance != null)) {
        exports.RESTful.instance = new exports.RESTful();
      }
      return exports.RESTful.instance;
    };

    _method = function(meth) {
      return function(url, data, ondone) {
        var method, settings;
        if ($.isFunction(data)) {
          ondone = data;
          data = {};
        }
        if (meth !== 'POST' && meth !== 'GET') {
          data = $.extend(data || {}, {
            '_method': meth
          });
        }
        method = meth === 'GET' ? 'GET' : 'POST';
        settings = {
          'url': url,
          'data': data,
          'dataType': 'json',
          'type': method
        };
        return _ajax(settings).done(ondone).fail(ondone);
      };
    };

    RESTful.prototype.$put = _method('PUT');

    RESTful.prototype.$delete = _method('DELETE');

    RESTful.prototype.$post = _method('POST');

    RESTful.prototype.$get = _method('GET');

    RESTful.prototype.$update = _method('PUT');

    RESTful.prototype.$create = _method('POST');

    return RESTful;

  }).call(this);
  return window.Rest = function() {
    return Alcarin.JQueryPlugins.RESTful.getInstance();
  };
  /*_caller = (method) =>
      (url, data, ondone) =>
          RESTfulInstance[method] url, data, ondone
  
  Alcarin.$put    = _caller '$put'
  Alcarin.$delete = _caller '$delete'
  Alcarin.$post   = _caller '$post'
  Alcarin.$get    = _caller '$get'
  true
  */

});
