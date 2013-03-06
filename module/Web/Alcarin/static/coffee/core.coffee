# Defining nice namespace support for coffee, check coffee-script FAQ for more info
namespace = (target, name, block) ->
    [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
    target._ = target.Alcarin = target.Alcarin or= {}
    main_ns = target.Alcarin

    target = target[item] or= {} for item in name.split '.'
    block target, main_ns

$ =>
    # find all objects with 'data-instance' attribute and try use it value as @_class.
    # it create instance of @_class with one argument - specific html element,
    # and call it "init" method if exists
    $('[data-instance]').each ->
        class_str = $(@).data 'instance'
        splitted = class_str.split '.'
        _class = window
        for str in splitted
            if _class[str]?
                _class = _class[str]
            else
                throw "Can not find instance of '#{class_str}' class."

        instance = new _class $(@)
        instance.init?()

    #prepare x-editable defaults
    $.fn.editable.defaults.ajaxOptions = {type: 'put', dataType: 'json'}
    # apply x-editable plugin
    $('.x-editable').editable()
    # apply jquery form plugin and generate 'ajax-submit' event when ajax-form is submitted
    $('.ajax-form').ajaxForm (response, a, b, form)->
        $(form).trigger 'ajax-submit', response

    # focus first input on site
    $('input[type="text"]:first').focus()

    # auto-init popover and tooltip
    $('.popover-invoke').popover()
    # disable selection on site
    $('body').disableSelection()