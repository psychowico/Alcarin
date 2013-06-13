# Catch js exception from some of webbrowser and log them, for develop purposes
namespace 'Alcarin.Errors', (exports, Alcarin) ->
    cookie_name = 'js-errors'
    ###errors nb will be stored in cookie and requests will be blocked when
    number reach this limit
    ###
    day_limit   = 5

    # autolog unexcepted js errors
    @onerror = (msg, url, line) ->
        $.cookie.raw = true

        cookie = $.cookie cookie_name
        if not cookie
            cookie = 0
            $.cookie cookie_name, cookie, { expires: 1 }
        else
            cookie = parseInt cookie
            return false if cookie >= day_limit
            $.cookie cookie_name, cookie + 1, { expires: 1 }

        # let get only url path
        url = url.split('/')[3..].join '/'
        data = {'msg': msg, 'url': url, 'line': line }

        # Rest().$create urls.api.errors, data

        $.cookie.raw = false
        false

    space = ->
        _console = window.console or {
            debug: ->
            log  : ->
            info : ->
            warn : ->
            error: ->
        }
        _console._error = _console.error

        _console.error = (_msg...)->
            msg = _msg[0]
            caller_stack = printStackTrace()[4]
            data = {mode: 'manual', stack: caller_stack, msg: msg}
            # Rest().$create urls.api.errors, data, (response)=>
            #     @warn response.errors unless response.success
            @_error msg for msg in _msg


        window.console = _console
    space()
