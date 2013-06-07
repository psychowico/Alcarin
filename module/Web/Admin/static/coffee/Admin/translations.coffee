'use strict'

namespace 'Alcarin.Admin', (exports, Alcarin) ->

    angular.module('translations', ['@proxy', '@chosen'])
        .factory('Translation', ['alc-resource', ($res)->
            $res urls.translations + '/:tagid', {tagid: "@tagid"}
        ])

    exports.Translations = ngcontroller [ 'Translation', (Translation)->
        @phrases = []
        @choose  =
            lang: 'pl'
            group: 'static'

        @selected = {
        }

        @reloadSentences = ->
            @$broadcast 'sentence-clear'
            @selected = ''
            Translation.query @choose, (_ph)=>
                @phrases = _ph

        @loadSentence = ->
            @$broadcast 'sentence-choosed'
    ]


    exports.SelectedTranslation = ngcontroller ['Translation', (Translation)->
        @tag = null
        @saving = false

        fetchSentence = =>
            @tag = Translation.get $.extend {tagid: @selected.tagid}, @choose

        @saveSentence = ->
            @saving = true
            @tag.$save @choose, => @saving = false

        @$on 'sentence-choosed', fetchSentence
        @$on 'sentence-clear', => @tag = null
    ]
