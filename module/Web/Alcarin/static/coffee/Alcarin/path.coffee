namespace 'Alcarin', (exports, Alcarin) ->

    class exports.Path

        @combine : (arg...)->
            path = '';
            for part in arg
                _arg = part.toString().replace '\\', '/'
                _arg = _arg[1..] if _arg[0] == '/'
                last = path[-1..0]
                path += '/' if last != '/'
                path += _arg

            if arg[0].indexOf 'http://' == 0 or arg[0].indexOf 'https://' == 0
                path = path[1..]
            path