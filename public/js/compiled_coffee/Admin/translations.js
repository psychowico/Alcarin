'use strict';

namespace('Alcarin.Admin', function(exports, Alcarin) {
  angular.module('translations', ['zf2-proxy', 'ng-chosen']).factory('zf2action', function(ZF2Action) {
    return ZF2Action(urls.translations);
  });
  return exports.Translations = ngcontroller(function(zf2action, $q) {
    this.selected = {
      tag: '',
      choose: {
        lang: 'pl',
        group: 'static'
      }
    };
    this.tag = null;
    this.saving = false;
    this.reloadSentences = function() {
      this.tag = null;
      this.selected.tag = '';
      return this.phrases = zf2action('get-sentences', this.selected.choose);
    };
    this.loadSentence = function() {
      var args,
        _this = this;
      args = angular.extend({
        tagid: this.selected.tag
      }, this.selected.choose);
      return zf2action('get-sentence', args, function(response) {
        return _this.tag = response.sentence;
      });
    };
    return this.saveSentence = function() {
      var _this = this;
      this.saving = true;
      return zf2action.post('save-sentence', {
        def: this.selected,
        tag: this.tag
      }, function() {
        return _this.saving = false;
      });
    };
  }, 'zf2action', '$q');
});
