'use strict'

namespace 'Alcarin.Admin', (exports, Alcarin) ->

    angular.module('translations', ['zf2-proxy', 'ng-chosen'])
           .factory('zf2action', (ZF2Action)->
                ZF2Action urls.translations
            )

    exports.Translations = ngcontroller (zf2action)->
        @choose = {
            lang: 'pl'
            group: 'static'
        }
        @tag = {
            id:     ''
            descr:  ''
        }
        @reloadPhrases = ->
            @phrases = zf2action 'get-sentences', @choose

        @loadSentence = (test)->
            #console.log @tag.id

    , 'zf2action'


    class exports.TranslationsCenter

        constructor: (@source)->
            @proxy = new Alcarin.EventProxy urls.translations

        on_sentences_reload: (response)=>
            if response.success
                @sentences_list = response.sentences
                @phrases_list.empty()
                if response.sentences.length == 0
                    @phrases_list.append $('<option>', {text: null})
                for sentence in response.sentences
                    @phrases_list.append $('<option>', {text: sentence})

                @phrases_list.update_chosen()
                @phrases_list.parent().spin false
                @phrases_list.trigger 'change'

        on_sentence_changed: (response)=>
            if response.success
                $editor = @source.find('.sentence-editor')
                sentence = response.sentence

                $editor.toggle $.isPlainObject response.sentence

        base_struct: =>
            {
                group: @group_choose.val()
                lang: @lang_choose.val(),
            }

        init: ->
            @proxy.on 'sentences.reload', @on_sentences_reload
            @proxy.on 'sentence.changed', @on_sentence_changed

            @group_choose = @source.find '.choose-group'
            @lang_choose = @source.find '.choose-lang'

            @phrases_list = @source.find '.phrases-list'

            @phrases_list.on 'change', =>
                if @phrases_list.val()?
                    @proxy.emit 'sentence.change', $.extend {
                        sentence: @phrases_list.val()
                    }, @base_struct()

            @lang_choose.add(@group_choose).on 'change', =>
                @phrases_list.parent().spin true
                @proxy.emit 'group.change', @base_struct()
            @lang_choose.trigger 'change'

