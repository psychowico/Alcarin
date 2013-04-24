namespace 'Alcarin.Admin', (exports, Alcarin) ->

    class exports.TranslationsDefCenter
        last_selected_arg: null
        empty_arg: null

        constructor: (@source)->
            @proxy = new Alcarin.EventProxy urls.translations

        submit_changes: =>
            option = @phrases_list.children ':selected'

            result = {
                id     : option.data('ref').id

                descr  : @form.find('.description textarea').val()
                content: @form.find('.content textarea').val()
                args   : []
            }
            for arg in @form_view.args().iterator()
                result.args.push {
                    descr: arg.descr()
                    type : arg.type()
                }

            @form.spin true
            @proxy.emit 'sentence.def.save', result
            return false

        new_tag_changed: (e)=>
            sender = $ e.currentTarget
            val = sender.val()
            res = @phrases_list.find "option[value=\"#{val}\"]"

            err = res.length > 0 or val == ''
            sender.parent().toggleClass 'error', err
            $('#add-tag-modal .btn-primary').enable not err

        on_sentence_saved: (response)=>
            @form.spin false if response.success

        new_tag_confirm: =>
            @proxy.emit 'sentence.def.create', {
                group: @group_choose.val()
                name: $('#new-tag-name').val()
            }

        on_sentence_def_created: (response)=>
            @group_choose.trigger 'change' if response.success

        arg_selected: (e)=>

            if @last_selected_arg != null
                @last_selected_arg.unbind '.selected-arg'
                @last_selected_arg = null
            else
                @empty_arg.unbind '.selected-arg'

            sel = $(e.currentTarget).find(':selected')
            if sel.size() > 0
                ref = sel.data 'active-view'
                ref.bind '.selected-arg'
                @last_selected_arg = ref
            else
                @empty_arg.bind '.selected-arg'

        arg_change: (e)=>
            $sel = @form_view.args().parents
            sel = $sel.val()
            if sel != null
                arg = @form_view.args().iterator()[sel]
                arg.descr @form.find('.arg-descr').val()
                arg.type @form.find('.arg-type').val()

        add_argument: (e)=>
            index = @form_view.args().length()

            _arg = new TranslateArgumentView

            _arg.update_index index
            _arg.descr "argument #{index} description"

            @form_view.args().push _arg
            @form_view.args().parents.val index
            @form_view.args().parents.trigger 'change'
            return false

        remove_argument: (e)=>
            $sel = @form_view.args().parents
            sel = $sel.val()
            if sel != null
                @form_view.args().removeAt sel
                max = @form_view.args().length() - 1
                if sel <= max
                    for i in [sel..max]
                        arg = @form_view.args().iterator()[i]
                        arg.update_index i
                $sel.trigger 'change'

            return false

        on_sentences_reload: (response)=>
            if response.success
                @phrases_list.empty()
                for sentence in response.def
                    option = $('<option>', {text: sentence.key, value: sentence.key})
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
                @form_view.content def.content
                args = def.args or []
                @form_view.args().clear()
                for arg, index in args
                    _arg = new TranslateArgumentView
                    _arg.update_index index
                    _arg.type arg.type or 0
                    _arg.descr arg.descr or ''
                    @form_view.args().push _arg

                @form.find('select.args').val(0).trigger 'change'

        init: ->
            @proxy.on 'sentences.def.reload', @on_sentences_reload
            @proxy.on 'sentence.def.changed', @on_sentence_changed
            @proxy.on 'sentence.def.saved', @on_sentence_saved
            @proxy.on 'sentence.def.created', @on_sentence_def_created


            @group_choose = @source.find '.choose-group'
            @phrases_list = @source.find '.phrases-list'
            $new_tag_modal = $ '#add-tag-modal'
            $new_tag_modal.on('success', @new_tag_confirm)
                .on 'show', =>
                    $new_tag_modal.find('form').reset()
            $('#new-tag-name').on 'keyup', @new_tag_changed

            @source.find('.arguments .plus').on 'click', @add_argument
            @source.find('.arguments .minus').on 'click', @remove_argument

            @source.find('.arguments .arg-descr').on 'keyup', @arg_change
            @source.find('.arguments .arg-type').on 'change', @arg_change
            @source.find('.confirm').on 'click', @submit_changes

            # preparing form view
            @form_view = form_view = new TranslateFormView()

            form_view.bind '.translation-panel form'
            form_view.args()

            @form = form_view.rel
            @form.find('select.args').on 'change', @arg_selected

            @empty_arg = new TranslateArgumentView()
            @empty_arg.bind '.selected-arg'

            @phrases_list.on 'change', =>
                if @phrases_list.val()?
                    @form.spin true
                    option = @phrases_list.children ':selected'
                    @proxy.emit 'sentence.def.change', {
                        id: option.data('ref').id
                    }

            @group_choose.on 'change', =>
                group = @group_choose.val()
                $new_tag_modal.find('.current-group').text group
                @phrases_list.parent().spin true
                @proxy.emit 'group.def.change', {
                    group: group
                }
            @group_choose.trigger 'change'

    class TranslateArgumentView extends Alcarin.ActiveView
        val    : @dependencyProperty 'val'
        name   : @dependencyProperty 'name'
        descr  : @dependencyProperty 'arg-description', ''
        type   : @dependencyProperty 'type', 0

        update_index: (index)=>
            @val index
            @name "arg-#{index}"

    class TranslateFormView extends Alcarin.ActiveView
        descr  : @dependencyProperty 'description', ''
        content: @dependencyProperty 'content', ''
        args   : @dependencyList '.arguments select.args'