namespace 'Alcarin', (exports, Alcarin) ->
    class exports.TestClass
        hashchange = (e)->
            state = $.bbq.getState() or {}
            window.scrollTo 0, 0
            $('.pages-container > .current').removeClass('current').fadeOut()
            $('.pages-container > .page-' + state.href).addClass('current').fadeIn()
            true

        init : =>
            $(window).bind 'hashchange', hashchange
            $('a').on 'click', ->
                href = $(@).attr('href').replace /^#/, ''
                state = { 'href': href }
                $.bbq.pushState( state );
                false
            false

    $ =>
        test = new Alcarin.TestClass()
        test.init()