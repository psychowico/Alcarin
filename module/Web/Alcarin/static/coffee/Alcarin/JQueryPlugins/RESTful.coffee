### Extending "Alcarin" namespace with 4 methods: get, insert, put, delete,
that can be useful with RESTful ajax requests.
All method has this same signature:
Alcarin.{methodName}(url, data, dataType)
where data and dataType can be ommited.
By default dataType == 'json'.
###

namespace 'Alcarin.JQueryPlugins', (exports, Alcarin) ->

    class exports.RESTful
        _ajax = null

        constructor: ->
            _ajax = jQuery.ajax

        _method = (meth) =>
            ( url, data, dataType ) ->
                dataType = dataType or 'json'
                data = $.extend ( data or {} ), {'_method': meth}

                method = if meth == 'GET' then 'GET' else 'POST'

                settings = {
                    'url'     : url,
                    'data'    : data,
                    'dataType': 'json',
                    'type'    : method
                }
                _ajax( settings )

        put    : _method('PUT')
        delete : _method('DELETE')
        post   : ( url, data, dataType ) ->
            settings = {
                'url'     : url,
                'data'    : data,
                'dataType': 'json',
                'type'    : 'POST'
            }
            _ajax( settings )
        get    : ( url, data, dataType ) ->
            settings = {
                'url'     : url,
                'data'    : data,
                'dataType': 'json',
                'type'    : 'GET'
            }
            _ajax( settings )

    RESTfulInstance = new Alcarin.JQueryPlugins.RESTful()

    _caller = (method) =>
        (url, data, dataType) =>
            RESTfulInstance[method] url, data, dataType

    Alcarin.put    = _caller 'put'
    Alcarin.delete = _caller 'delete'
    Alcarin.post   = _caller 'post'
    Alcarin.get    = _caller 'get'
    true
