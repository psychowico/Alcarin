'use strict'

namespace 'Alcarin.Admin', (exports, Alcarin) ->

    angular.module('translations', ['zf2-proxy', 'ng-chosen'])
           .factory('Translations', ['ZF2Action', (ZF2Action)->
                ZF2Action urls.translations
            ])

    exports.Translations = ngcontroller [ 'Translations', (Translations)->
        @selected = {
            tag: ''
            choose: {
                lang: 'pl'
                group: 'static'
            }
        }

        @reloadSentences = ->
            @$broadcast 'sentence-clear'
            @selected.tag = ''
            @phrases = Translations 'get-sentences', @selected.choose

        @loadSentence = ->
            @$broadcast 'sentence-choosed'
    ]


    exports.SelectedTranslation = ngcontroller (Translations)->
        @tag = null
        @saving = false

        fetchSentence = =>
            args = angular.extend {tagid: @selected.tag}, @selected.choose
            Translations 'get-sentence', args, (response)=>
                @tag = response.sentence

        @saveSentence = ->
            @saving = true
            Translations.post 'save-sentence', {
                def: @selected
                tag: @tag
            }, => @saving = false

        @$on 'sentence-choosed', fetchSentence
        @$on 'sentence-clear', => @tag = null


    , 'Translations'
