'use strict'

namespace 'Alcarin.Angular', (exports, Alcarin) ->

    # simple event bus - because I not trust angularjs $broadcast events system
    # when we will have many of scopes.
    # I use "angular._module" defined in "core.coffee" to avoid cross-reference
    angular._module('@core', [])
        .run(['$rootScope', ($rootScope)->
            $rootScope.$safeApply = (_meth)->
                if $rootScope.$$phase
                    _meth()
                else
                    $rootScope.$apply => _meth()
        ]).factory('@EventsBus', ->
            class EventsBus
                listeners = {}

                on: (name, meth)->
                    listeners[name] = [] if not listeners[name]?
                    listeners[name].push meth

                emit: (name, args...)->
                    if listeners[name]?
                        _meth.apply window, args for _meth in listeners[name]
            new EventsBus()
        )
        # .filter('nl2br', ->
        #     (val)->
        #         (val + '').replace /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2'
        # )
