namespace 'Alcarin.JQueryPlugins', (exports, Alcarin) ->

    $.fn.center = ()->
        _ = $ @
        { left: _.width() / 2, top: _.height() / 2}

    # adding relative position set feature
    _old_position = $.fn.position
    $.fn.position = (arg)->
        if $.isPlainObject arg
            if arg.top?
                @.css 'top', "#{arg.top}px"
            if arg.left?
                @.css 'left', "#{arg.left}px"
            return @
        _old_position.call(@)