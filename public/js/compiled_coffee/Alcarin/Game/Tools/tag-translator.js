'use strict';
namespace('Alcarin.Game.Tools', function(exports, Alcarin) {
  var reg;
  reg = /%([0-9])+/g;
  return exports.TagTranslator = function(tag) {
    var arg, arg_index, fArg, match, offset, output, pre_text, _args, _text;
    _text = tag.text;
    _args = tag.args;
    output = [];
    offset = 0;
    while (match = reg.exec(_text)) {
      arg_index = parseInt(match[1]);
      arg = _args[arg_index];
      if ($.isPlainObject(arg)) {
        fArg = $.extend({
          text: arg.text
        }, arg.__base);
      } else {
        fArg = {
          text: arg,
          type: 'text'
        };
      }
      pre_text = _text.substr(offset, match.index);
      if (pre_text.length > 0) {
        output.push({
          text: pre_text,
          type: 'text'
        });
      }
      output.push(fArg);
      _text = _text.substr(match.index + match[0].length);
    }
    if (_text.length > 0) {
      output.push({
        text: _text,
        type: 'text'
      });
    }
    return output;
  };
});

/*
//@ sourceMappingURL=tag-translator.js.map
*/
