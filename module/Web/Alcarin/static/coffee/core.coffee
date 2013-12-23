'use strict'

# Defining nice namespace support for coffee, check coffee-script FAQ for more info
namespace = (target, name, block) ->
    [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
    #target._ = target.Alcarin = target.Alcarin or= {}
    main_ns = target.Alcarin

    target = target[item] or= {} for item in name.split '.'
    block target, main_ns

Array.prototype.remove = (obj)->
    ind = @indexOf obj
    @splice ind, 1

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
    # automatic add @core module from ngx-core.coffee
    args[1].push '@core', '@jquery-anims', 'ngAnimate-animate.css'
    if args.length < 3
        args.push ['$interpolateProvider', ($ip)->
            $ip.startSymbol('{*').endSymbol('*}')
        ]
    angular._module.apply(angular, args)
        # temporary code to fix all auto unwrapping promises cases
        # https://github.com/angular/angular.js/commit/5dc35b527b3c99f6544b8cb52e93c6510d3ac577
        .config ($parseProvider)-> $parseProvider.unwrapPromises true

$ =>
    # focus first input on site
    $('input[type="text"],textarea:first').focus()

    $('.modal-footer .btn-primary').on 'click', (e)->
        result = $(@).trigger 'success', e
    $('.modal').on 'success', (e)->
        $(@).modal 'hide' if not e.isDefaultPrevented()

    # disable selection on site
    $('body').disableSelection()
