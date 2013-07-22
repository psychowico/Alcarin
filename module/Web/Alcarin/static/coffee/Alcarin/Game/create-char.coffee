'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    angular.module 'create-char', ['ui.event']

    exports.CreateChar = ngcontroller ->

        @mouseMove = (ev)=>
            $target = $(ev.target)
            if $target.hasClass 'radio'
                $target = $target.children('input')
            @hover = $target.data('descr')

