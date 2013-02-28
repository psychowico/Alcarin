
namespace 'Alcarin.JQueryPlugins', (exports, Alcarin) ->

    $.fn._method = (method)->
        method = method.toUpperCase()
        @filter('form').each ->
            $(@).find('input[name="_method"]').val method