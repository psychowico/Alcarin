'use strict'

#
# tag translation is the process of working up the text
# and a list of arguments for a list of objects that contain fragments of text
# and object-oriented description of a particular piece of property.
# example:
#
# input object: {text: "I, %0, like bananas.", [{text: "Filipe", type: "char"}]}
# output:
# [{text: "I, ", type: "text"}, {text: "Filipe", type: "char"}, {text:", like bananas.", type: "text"}]
#
# this kind of list are easier to display and manage by angularjs mechanism, in our templates
#

namespace 'Alcarin.Game.Tools', (exports, Alcarin) ->

    reg = /%([0-9])+/g
    exports.TagTranslator = (tag)->
        _text = tag.text
        _args = tag.args

        output = []
        offset = 0

        while match = reg.exec _text
            arg_index = parseInt match[1]
            arg = _args[arg_index]
            if $.isPlainObject arg
                fArg = $.extend {text: arg.text}, arg.__base
                # GameObjectFactory fArg
            else
                fArg =
                    text: arg
                    type: 'text'

            pre_text = _text.substr offset, match.index
            output.push {text: pre_text, type: 'text'} if pre_text.length > 0
            output.push fArg

            _text = _text.substr match.index + match[0].length

        if output.length == 0
            output.push
                text: _text
                type: 'text'

        return output
