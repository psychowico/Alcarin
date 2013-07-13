'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    angular.module('@jquery-anims')
        .animation '$slideDown', ->
            setup : (e)-> e.hide()
            start : (e, done)-> e.slideDown -> done()
            cancel : (e)-> e.stop()
        .animation '$slideUp', ->
            setup : (e)-> e.show()
            start: (e, done)-> e.slideUp -> done()
            cancel : (e)-> e.stop()
