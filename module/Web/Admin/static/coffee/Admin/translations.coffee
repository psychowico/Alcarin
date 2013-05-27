'use strict'

namespace 'Alcarin.Admin', (exports, Alcarin) ->

    angular.module('translations', ['zf2-proxy', 'ng-chosen'])
           .factory('zf2action', (ZF2Action)->
                ZF2Action urls.translations
            )

    exports.Translations = ngcontroller (zf2action, $q)->
        @selected = {
            tag: ''
            choose: {
                lang: 'pl'
                group: 'static'
            }
        }
        @tag = null
        @saving = false

        @reloadSentences = ->
            @tag = null
            @selected.tag = ''
            @phrases = zf2action 'get-sentences', @selected.choose

        @loadSentence = ->
            args = angular.extend {tagid: @selected.tag}, @selected.choose
            zf2action 'get-sentence', args, (response)=>
                @tag = response.sentence

        @saveSentence = ->
            @saving = true
            zf2action.post 'save-sentence', {
                def: @selected
                tag: @tag
            }, => @saving = false

    , 'zf2action', '$q'
