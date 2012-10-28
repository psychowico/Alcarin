namespace 'Alcarin', (exports, Alcarin) ->
    $ =>
        test = new Alcarin.TestClass()

    class exports.TestClass
        factor : (x) => x * x