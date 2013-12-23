'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    angular.module('@jquery-anims', ['ngAnimate'])
        .animation '.anim-slide', ->
            enter: (e, done)->
                e.hide().slideDown -> done()
                return (isCancelled)-> e.stop() if isCancelled
            leave: (e, done)->
                e.slideUp -> done()
                return (isCancelled)-> e.stop() if isCancelled
        .animation '.anim-slide-show', ->
            removeClass: (e, cn, done)->
                e.hide().slideDown -> done()
                return (isCancelled)-> e.stop() if isCancelled
            beforeAddClass: (e, cn, done)->
                e.slideUp -> done()
                return (isCancelled)-> e.stop() if isCancelled
