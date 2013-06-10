namespace 'Alcarin.Dialogs', (exports, Alcarin) ->

    class exports.Confirms
        # remember to use callback instead method
        # result - because in future this can be non-blocking method
        @admin: (query, onconfirm, onreject)->
            result = confirm query
            if result and onconfirm?
                onconfirm()
            else if not result and onreject?
                onreject()
            return result
