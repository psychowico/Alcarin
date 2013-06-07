'use strict';

namespace('Alcarin.Admin', function(exports, Alcarin) {
  angular.module('translations', ['@proxy', '@chosen']).factory('Translations', [
    'ZF2Action', function(ZF2Action) {
      return ZF2Action(urls.translations);
    }
  ]);
  exports.Translations = ngcontroller([
    'Translations', function(Translations) {
      this.selected = {
        tag: '',
        choose: {
          lang: 'pl',
          group: 'static'
        }
      };
      this.reloadSentences = function() {
        this.$broadcast('sentence-clear');
        this.selected.tag = '';
        return this.phrases = Translations('get-sentences', this.selected.choose);
      };
      return this.loadSentence = function() {
        return this.$broadcast('sentence-choosed');
      };
    }
  ]);
  return exports.SelectedTranslation = ngcontroller([
    'Translations', function(Translations) {
      var fetchSentence,
        _this = this;
      this.tag = null;
      this.saving = false;
      fetchSentence = function() {
        var args;
        args = angular.extend({
          tagid: _this.selected.tag
        }, _this.selected.choose);
        return Translations('get-sentence', args, function(response) {
          return _this.tag = response.sentence;
        });
      };
      this.saveSentence = function() {
        var _this = this;
        this.saving = true;
        return Translations.post('save-sentence', {
          def: this.selected,
          tag: this.tag
        }, function() {
          return _this.saving = false;
        });
      };
      this.$on('sentence-choosed', fetchSentence);
      return this.$on('sentence-clear', function() {
        return _this.tag = null;
      });
    }
  ]);
});
