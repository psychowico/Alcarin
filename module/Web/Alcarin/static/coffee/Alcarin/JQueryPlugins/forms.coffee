
namespace 'Alcarin.JQueryPlugins', (exports, Alcarin) ->

    $.fn._method = (method)->
        if not method?
            return @filter('form').first().find('input[name="_method"]').val().toLowerCase()
        method = method.toUpperCase()
        @filter('form').each ->
            $(@).find('input[name="_method"]').val method

    $.fn.disableSelection = ->
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false)
