var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Admin', function(exports, Alcarin) {
  return exports.TranslationsCenter = (function() {

    function TranslationsCenter(source) {
      this.source = source;
      this.on_sentences_reload = __bind(this.on_sentences_reload, this);

      this.proxy = new Alcarin.EventProxy(urls.translations);
    }

    TranslationsCenter.prototype.on_sentences_reload = function(response) {
      var sentence, _i, _len, _ref;
      if (response.success) {
        this.sentences_list = response.sentences;
        this.phrases_list.empty();
        _ref = response.sentences;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sentence = _ref[_i];
          this.phrases_list.append($('<option>', {
            text: sentence
          }));
        }
        this.phrases_list.update_chosen();
        return this.phrases_list.parent().spin(false);
      }
    };

    TranslationsCenter.prototype.init = function() {
      var $gruop_choose, $lang_choose,
        _this = this;
      this.proxy.on('sentences.reload', this.on_sentences_reload);
      $gruop_choose = this.source.find('.choose-group');
      $lang_choose = this.source.find('.choose-lang');
      this.phrases_list = this.source.find('.phrases-list');
      return $lang_choose.add($gruop_choose).on('change', function() {
        _this.phrases_list.parent().spin(true);
        return _this.proxy.emit('group.change', {
          group: $gruop_choose.val(),
          lang: $lang_choose.val()
        });
      }).trigger('change');
    };

    return TranslationsCenter;

  })();
});
