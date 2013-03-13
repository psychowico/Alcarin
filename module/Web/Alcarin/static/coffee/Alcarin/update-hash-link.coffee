namespace 'Alcarin', (exports, Alcarin ) ->

    class exports.UpdateHashLink
        @maxid : 0
        id : 0
        _el      : null
        @default_options : {
            event       : 'click',
            target_state: null,
        }

        _activate : =>
            if @_options.target_state instanceof Function
                @_options.target_state = @_options.target_state.call(@_el)

            $.bbq.pushState( @_options.target_state )
            false

        constructor : ( el, options )->
            @id = UpdateHashLink.maxid++
            @_options = $.extend {}, exports.UpdateHashLink.default_options, options
            @_el = $ el
            #update href when clicked
            @_el.on @_options.event, @_activate

    class exports.TestClass
        hashchange = (e)->
            state = $.bbq.getState() or {}
            window.scrollTo 0, 0
            $('.pages-container > .current').removeClass('current').fadeOut()
            $('.pages-container > .page-' + state.href).addClass('current').fadeIn()

            $('#main-nav > nav > ul > .current').removeClass 'current'
            $('#main-nav a[data-hash-href="' + state.href + '"]').closest('li').addClass 'current'

            true

        init : =>
            $(window).bind 'hashchange', hashchange
            ###$('#main-nav a').on 'click', ->
                href = $(@).attr('href').replace /^#/, ''
                state = { 'href': href }
                $.bbq.pushState( state )
                false###
            false

    $ =>
        $.fn.hashLink = (_target_state, _options)->
            @each ->
                target_state = _target_state
                options = _options
                if not target_state?
                    target_state = {}
                    data = $(@).data()
                    for key, obj of data
                        if /^hash[A-Z]/.test key
                            new_key = key.replace /^hash/, ''
                            target_state[new_key.toLowerCase()] = obj

                options = options or {}
                options.target_state = target_state

                link = new Alcarin.UpdateHashLink @, options
                $(@).data 'hashLink', link

        $('.active-link').hashLink()
        $('#active-select').data('hash-test', 313).hashLink()

        test = new Alcarin.TestClass()
        test.init()

        #let turn off animation when page is loading
        jQuery.fx.off = true
        $(window).trigger('hashchange')
        jQuery.fx.off = false