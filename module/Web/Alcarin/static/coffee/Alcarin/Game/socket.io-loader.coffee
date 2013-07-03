'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    # we need use this trick, because error callback is never call by
    # jquery when we use crossdomain (diffrent port is crossdomain :/)
    # GET.
    exports.loadSocketLibrary = (host, socket_port)->
        deffered = Q.defer()

        loaded = false
        url = "http://#{host}:#{socket_port}/socket.io/socket.io.js"

        loadScript = (intId)->
            $.getScript url, ->
                window.clearInterval intId
                deffered.resolve()

        intId = window.setInterval (-> loadScript intId), 5000
        loadScript intId

        deffered.promise