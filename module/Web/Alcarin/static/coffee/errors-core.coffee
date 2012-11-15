# Catch js exception from some of webbrowser and log them, for develop purposes
namespace 'Alcarin.JQueryPlugins', (exports, Alcarin) ->
    cookie_name = 'js-errors'
    ###errors nb will be stored in cookie and requests will be blocked when
    number reach this limit
    ###
    day_limit   = 5

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

        if _.post
            data = {'msg': msg, 'url': url, 'line': line }
            _.post '/api/errors/external', data

        $.cookie.raw = false
        false