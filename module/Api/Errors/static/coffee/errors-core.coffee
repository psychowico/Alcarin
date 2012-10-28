# Catch js exception from some of webbrowser and log them, for develop purposes
namespace 'Alcarin.JQueryPlugins', (exports, Alcarin) ->
    @onerror = (msg, url, line) =>
        if _.post
            data = {'msg': msg, 'url': url, 'line': line }
            _.post '/api/errors/external', data
            return true
        false