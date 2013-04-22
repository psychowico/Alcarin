namespace 'Alcarin.Admin', (exports, Alcarin) ->

    class exports.TranslationsCenter

        constructor: (@source)->
            @proxy = new Alcarin.EventProxy urls.translations

        on_sentences_reload: (response)=>
            if response.success
                @sentences_list = response.sentences
                @phrases_list.empty()
                for sentence in response.sentences
                    @phrases_list.append $('<option>', {text: sentence})

                @phrases_list.update_chosen()
                @phrases_list.parent().spin false


        init: ->
            @proxy.on 'sentences.reload', @on_sentences_reload

            $gruop_choose = @source.find '.choose-group'
            $lang_choose = @source.find '.choose-lang'

            @phrases_list = @source.find '.phrases-list'

            $lang_choose.add($gruop_choose).on 'change', =>
                @phrases_list.parent().spin true
                @proxy.emit 'group.change', {
                    group: $gruop_choose.val()
                    lang: $lang_choose.val(),
                }
            .trigger 'change'
