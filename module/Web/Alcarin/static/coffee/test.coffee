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
            $('#main-nav a').on 'click', ->
                href = $(@).attr('href').replace /^#/, ''
                state = { 'href': href }
                $.bbq.pushState( state );
                $(@).closest('ul').children('li').removeClass 'current'
                $(@).closest('li').addClass 'current'
                false
            false

    $ =>
        test = new Alcarin.TestClass()
        test.init()