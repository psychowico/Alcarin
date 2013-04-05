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

        @getInstance: ->
            if not exports.RESTful.instance?
                exports.RESTful.instance = new exports.RESTful()
            exports.RESTful.instance

        _method = (meth) =>
            ( url, data, ondone ) ->
                if $.isFunction url
                    ondone = url
                    data   = {}
                    url    = null
                else if $.isFunction data
                    ondone = data
                    data = {}

                data = $.extend ( data or {} ), {'_method': meth} if meth != 'POST' and meth != 'GET'

                method = if meth == 'GET' then 'GET' else 'POST'

                settings = {
                    'url'     : url
                    'data'    : data
                    'dataType': 'json'
                    'type'    : method
                }
                ondone = @ondone(ondone)
                _ajax( settings ).done(ondone).fail(ondone)

        ondone: (_ondone)->
            (response)->
                if response.success == false and response.errors?
                    console.error response.errors

                _ondone(response)

        $put    : _method('PUT')
        $delete : _method('DELETE')
        $post   : _method('POST')
        $get    : _method('GET')

        #aliases
        $update : _method('PUT')
        $create : _method('POST')

    #let polute global namespace = this class will be really often use
    window.Rest = ()->
        return Alcarin.JQueryPlugins.RESTful.getInstance()

    ###_caller = (method) =>
        (url, data, ondone) =>
            RESTfulInstance[method] url, data, ondone

    Alcarin.$put    = _caller '$put'
    Alcarin.$delete = _caller '$delete'
    Alcarin.$post   = _caller '$post'
    Alcarin.$get    = _caller '$get'
    true###
