# Defining nice namespace support for coffee, check coffee-script FAQ for more info
namespace = (target, name, block) ->
    [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
    target._ = target.Alcarin = target.Alcarin or= {}
    main_ns = target.Alcarin

    target = target[item] or= {} for item in name.split '.'
    block target, main_ns

$ =>
    $('input[type="text"]:first').focus()