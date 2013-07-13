'use strict'

namespace 'Alcarin', (exports, Alcarin) ->

    class exports.EventsEmitter

        $on: (name, meth)->
            if not meth?
                throw Error "Can not react on undefined event. Event name: #{name}"
            @$_listeners = @$_listeners or {}

            @$_listeners[name] = [] if not @$_listeners[name]?
            @$_listeners[name].push meth

        $emit: (name, args...)->
            @$_listeners = @$_listeners or {}

            if @$_listeners[name]?
                _meth.apply @, args for _meth in @$_listeners[name]
            if @$_listeners['*']?
                _meth.call @, {name: name, args: args} for _meth in @$_listeners['*']