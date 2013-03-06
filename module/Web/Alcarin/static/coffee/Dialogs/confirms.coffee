namespace 'Alcarin.Dialogs', (exports, Alcarin) ->

    class exports.Confirms
        @admin: (query, onconfirm, onreject)->
            result = confirm query
            if result and onconfirm?
                onconfirm()
            else if not result and onreject?
                onreject()
