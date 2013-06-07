'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    angular.module('@jquery-anims')
        .animation '$slideDown', ->
            setup : (element)-> element.hide()
            start : (element, done)->
                element.slideDown -> done()
        .animation '$slideUp', ->
            start: (e, done)-> e.slideUp -> done()
