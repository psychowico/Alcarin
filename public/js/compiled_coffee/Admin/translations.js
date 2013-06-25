'use strict';namespace('Alcarin.Admin', function(exports, Alcarin) {
  angular.module('translations', ['@proxy', '@chosen']).factory('Translation', [
    'alc-resource', function($res) {
      return $res(urls.translations + '/:tagid', {
        tagid: "@tagid"
      });
    }
  ]);
  exports.Translations = ngcontroller([
    'Translation', function(Translation) {
      this.phrases = [];
      this.varieties = {
        std: 'visible by myself',
        others: 'visible by others'
      };
      this.choose = {
        lang: 'pl',
        group: 'static'
      };
      this.selected = {};
      this.reloadSentences = function() {
        var _this = this;

        this.$broadcast('sentence-clear');
        this.selected = '';
        return Translation.query(this.choose, function(_ph) {
          return _this.phrases = _ph;
        });
      };
      return this.loadSentence = function() {
        return this.$broadcast('sentence-choosed');
      };
    }
  ]);
  return exports.SelectedTranslation = ngcontroller([
    'Translation', function(Translation) {
      var fetchSentence,
        _this = this;

      this.tag = null;
      this.saving = false;
      this.variety = 'std';
      fetchSentence = function() {
        return _this.tag = Translation.get($.extend({
          tagid: _this.selected.tagid
        }, _this.choose));
      };
      this.saveSentence = function() {
        var _this = this;

        this.saving = true;
        return this.tag.$save(this.choose, function() {
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

/*
//@ sourceMappingURL=translations.js.map
*/
