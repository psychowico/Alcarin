'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    success = (x)-> console.log 'success: ' + x
    fail = (x)-> console.log 'fail: ' + x
    exports.loadSocketLibrary = (host, socket_port)->
        # we need use this trick, because error callback is never call by
        # jquery when we use crossdomain (diffrent port is crossdomain :/)
        # GET.
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