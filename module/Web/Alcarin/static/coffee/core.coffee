'use strict'

# Defining nice namespace support for coffee, check coffee-script FAQ for more info
namespace = (target, name, block) ->
    [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
    #target._ = target.Alcarin = target.Alcarin or= {}
    main_ns = target.Alcarin

    target = target[item] or= {} for item in name.split '.'
    block target, main_ns

# shorter angular  controller, check translations.cofffee for use example
ngcontroller = (block)->
    block = [block] if not $.isArray block

    args = if block.length > 1 then block[0...-1] else []
    fun = block[-1..][0]

    inv = ['$scope'].concat args
    inv.push ($scope, _args...)->
        fun.apply($scope, _args)
    inv

# override angularjs default module method, to use {* *} delimiters as default
angular._module = angular.module
angular.module = (args...)->
    args.push [] if args.length < 2
    if args.length < 3
        args.push ($interpolateProvider)->
            $interpolateProvider.startSymbol('{*').endSymbol('*}')
    angular._module.apply angular, args

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

    # prevent auto-commit all form with 'ajax-form' class
    $('.ajax-form').on 'submit', (e)->
        e.preventDefault()

    # focus first input on site
    $('input[type="text"]:first').focus()

    $('.modal-footer .btn-primary').on 'click', (e)->
        result = $(@).trigger 'success', e
    $('.modal').on 'success', (e)->
        $(@).modal 'hide' if not e.isDefaultPrevented()

    # disable selection on site
    $('body').disableSelection()