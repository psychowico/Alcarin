namespace 'Alcarin.Admin', (exports, Alcarin) ->

    class exports.TranslationsDefCenter

        constructor: (@source)->
            @proxy = new Alcarin.EventProxy urls.translations

        arg_changed: (e)=>
            @form_view.arg_descr ''
            sel = $(e.currentTarget).find(':selected')
            if sel.size() > 0
                ref = sel.data 'active-view'
                @form_view.arg_descr ref.descr

        arg_desc_change: (e)=>
            sel = @form_view.args().parents.val()
            if sel != null
                arg = @form_view.args().iterator()[sel]
                arg.descr =  $(e.currentTarget).val()

        add_argument: (e)=>
            index = @form_view.args().length()

            _arg = new TranslateArgumentView

            _arg.update_index index
            _arg.descr = "argument #{index} description"

            @form_view.args().push _arg
            @form_view.args().parents.val index
            @form_view.args().parents.trigger 'change'
            return false

        remove_argument: (e)=>
            sel = @form_view.args().parents.val()
            if sel != null
                @form_view.args().removeAt sel
                max = @form_view.args().length() - 1
                for i in [sel..max]
                    console.log i
                    arg = @form_view.args().iterator()[i]
                    arg.update_index i


            return false

        on_sentences_reload: (response)=>
            if response.success
                @phrases_list.empty()
                for sentence in response.def
                    option = $('<option>', {text: sentence.key})
                    option.data 'ref', sentence
                    @phrases_list.append option

                @phrases_list.update_chosen()
                @phrases_list.parent().spin false
                @phrases_list.trigger 'change'

        on_sentence_changed: (response)=>
            @form.spin false
            if response.success
                def = response.def
                @form_view.descr def.descr
                args = def.args or []
                @form_view.args().clear()
                for arg, index in args
                    _arg = new TranslateArgumentView
                    _arg.update_index index
                    _arg.descr = arg.descr or ''
                    @form_view.args().push _arg

                @form.find('select.args').val(0).trigger 'change'

        init: ->
            @proxy.on 'sentences.def.reload', @on_sentences_reload
            @proxy.on 'sentence.def.changed', @on_sentence_changed

            @group_choose = @source.find '.choose-group'
            @phrases_list = @source.find '.phrases-list'

            @source.find('.arguments .plus').on 'click', @add_argument
            @source.find('.arguments .minus').on 'click', @remove_argument
            @source.find('.arguments .arg-descr').on 'keyup', @arg_desc_change

            # preparing form view
            @form_view = form_view = new TranslateFormView()

            form_view.bind '.translation-panel form'
            form_view.args()

            @form = form_view.rel
            @form.find('select.args').on 'change', @arg_changed

            @phrases_list.on 'change', =>
                if @phrases_list.val()?
                    @form.spin true
                    option = @phrases_list.children ':selected'
                    @proxy.emit 'sentence.def.change', {
                        id: option.data('ref').id
                    }

            @group_choose.on 'change', =>
                @phrases_list.parent().spin true
                @proxy.emit 'group.def.change', {
                    group: @group_choose.val()
                }
            @group_choose.trigger 'change'

    class TranslateArgumentView extends Alcarin.ActiveView
        val    : @dependencyProperty 'val'
        name   : @dependencyProperty 'name'
        descr  : ''

        update_index: (index)=>
            @val index
            @name "arg-#{index}"

    class TranslateFormView extends Alcarin.ActiveView
        descr    : @dependencyProperty 'description'
        arg_descr: @dependencyProperty 'descr_arg', ''
        args     : @dependencyList '.arguments select'