var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Admin', function(exports, Alcarin) {
  angular.module('translations', ['alcarin-events']).factory('zf2action', function(ZF2Action) {
    return ZF2Action(urls.translations);
  });
  exports.Translations = function($scope, zf2action) {
    $scope.choose = {
      lang: 'pl',
      group: 'static'
    };
    return $scope.reloadPhrases = function() {
      return $scope.phrases = zf2action('get-sentences', $scope.choose);
    };
  };
  return exports.TranslationsCenter = (function() {

    function TranslationsCenter(source) {
      this.source = source;
      this.base_struct = __bind(this.base_struct, this);

      this.on_sentence_changed = __bind(this.on_sentence_changed, this);

      this.on_sentences_reload = __bind(this.on_sentences_reload, this);

      this.proxy = new Alcarin.EventProxy(urls.translations);
    }

    TranslationsCenter.prototype.on_sentences_reload = function(response) {
      var sentence, _i, _len, _ref;
      if (response.success) {
        this.sentences_list = response.sentences;
        this.phrases_list.empty();
        if (response.sentences.length === 0) {
          this.phrases_list.append($('<option>', {
            text: null
          }));
        }
        _ref = response.sentences;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sentence = _ref[_i];
          this.phrases_list.append($('<option>', {
            text: sentence
          }));
        }
        this.phrases_list.update_chosen();
        this.phrases_list.parent().spin(false);
        return this.phrases_list.trigger('change');
      }
    };

    TranslationsCenter.prototype.on_sentence_changed = function(response) {
      var $editor, sentence;
      if (response.success) {
        $editor = this.source.find('.sentence-editor');
        sentence = response.sentence;
        return $editor.toggle($.isPlainObject(response.sentence));
      }
    };

    TranslationsCenter.prototype.base_struct = function() {
      return {
        group: this.group_choose.val(),
        lang: this.lang_choose.val()
      };
    };

    TranslationsCenter.prototype.init = function() {
      var _this = this;
      this.proxy.on('sentences.reload', this.on_sentences_reload);
      this.proxy.on('sentence.changed', this.on_sentence_changed);
      this.group_choose = this.source.find('.choose-group');
      this.lang_choose = this.source.find('.choose-lang');
      this.phrases_list = this.source.find('.phrases-list');
      this.phrases_list.on('change', function() {
        if (_this.phrases_list.val() != null) {
          return _this.proxy.emit('sentence.change', $.extend({
            sentence: _this.phrases_list.val()
          }, _this.base_struct()));
        }
      });
      this.lang_choose.add(this.group_choose).on('change', function() {
        _this.phrases_list.parent().spin(true);
        return _this.proxy.emit('group.change', _this.base_struct());
      });
      return this.lang_choose.trigger('change');
    };

    return TranslationsCenter;

  })();
});
