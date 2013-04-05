
namespace 'Alcarin.JQueryPlugins', (exports, Alcarin) ->

    class exports.AlcarinForm

        constructor: (@base)->
            @base.on 'submit', @_on_submit

        enable_proxy: (proxy, emit_order, response_event)->
            if @proxy?
                @proxy.off @response_event, @_on_response if @response_event?
                @proxy.off 'response.empty', @enable

            @proxy = proxy
            @set_emit_order emit_order if emit_order?
            @set_response_event response_event if response_event?

            @proxy.on 'response.empty', @enable

        on_success: (callback)->
            @on_success_callback = callback

        on_fail: (callback)->
            @on_fail_callback = callback

        set_emit_order: (emit_order)->
            if not @proxy? then throw Error 'Enable form proxy first.'
            @emit_order = emit_order

        set_response_event: (response_event)->
            if not @proxy? then throw Error 'Enable form proxy first.'
            @proxy.off @response_event, @_on_response
            @proxy.on response_event, @_on_response
            @response_event = response_event

        disable: =>
            @base.find(':submit').disable()

        enable: =>
            @base.find(':submit').enable()

        _on_submit: =>
            return false if @base.find(':submit').disabled()
            if @proxy?
                @disable()
                @proxy.emit @emit_order, @base.serializeForm()
                return false

        _on_response: (response)=>
            if response.success
                @on_success_callback? response
            else
                @_sign_error_fields response.errors
                @on_fail_callback? response
            @_clear_error_fields()
            @enable()

        _clear_error_fields: ->
            @base.find('.control-group').removeClass 'error'
            @base.find('.tmp-line').remove()

        _sign_error_fields: (wrong_fields)->
            @_clear_error_fields()
            for field, value of wrong_fields
                control = @base.find "[name='#{field}']"
                control.closest('.control-group').addClass 'error'

                for id, error of value then break
                error_line = $('<span>', {class: 'help-inline tmp-line', text: error})
                control.after error_line

        reset: ->
            @_clear_error_fields()
            @base.reset()

    $.fn.alcForm = ->
        $form = @filter('form').first()
        alc_form = $form.data 'alcarin-form'
        if not alc_form?
            alc_form = new Alcarin.JQueryPlugins.AlcarinForm $form
            $form.data 'alcarin-form', alc_form
        alc_form

    $.fn._method = (method)->
        if not method?
            return @filter('form').first().find('input[name="_method"]').val().toLowerCase()
        method = method.toUpperCase()
        @filter('form').each ->
            $(@).find('input[name="_method"]').val method

    $.fn.serializeForm = ->
        result = {}
        for o in @serializeArray()
            result[o.name] = o.value
        result