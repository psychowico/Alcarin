namespace 'Alcarin.Orbis.Editor', (exports, Alcarin) ->

    angular.module('orbis.editor', ['@slider', '@map-manager', '@spin', 'ui.event',
        '@disabled', '@color-picker'])
       .config(['$routeProvider', ($routeProvider)->
            $routeProvider
                .when '/x=:x&y=:y',
                    controller: exports.Editor
                .otherwise
                    redirectTo: '/x=0&y=0'
        ])
        .factory('Map', ['$http', ($http)->
            fetch: (_x, _y, callback)->
                service = $http.get "#{urls.orbis.map}/fetch-fields",
                    params: {x:_x, y:_y}
                .then((response)-> response.data)
                service.then callback if callback?
                service
            update: (_fields, callback)->
                # cast to array, object are bigger (when sending)
                changes = $.map _fields, (value, key) -> value
                # we sending changes as json coded string, because if we send big
                # number of fields, we will have problems with servers vars count limits
                changes = JSON.stringify changes
                $http
                    url: "#{urls.orbis.map}/update-fields",
                    method: 'POST',
                    data: $.param
                        fields: changes
                    headers:
                        'Content-Type': 'application/x-www-form-urlencoded'
                .then callback
        ])

    # route need be injected somewhere for angularjs routing working purposes
    exports.App = ngcontroller ['$route', '$window', ($r, $window)->
        @mapsaving = false
        @has_changes = false

        @brush      =
            color: {r:0, g:128, b:0}
            size : 4

        @$on 'map.changed', =>
            @has_changes = true
            @ignored_changes = false

        @$on 'map.reset', =>
            @ignored_changes = @has_changes = false

        $($window).on 'beforeunload', -> 'You lost your unsaved changes! You are sure?' if @has_changes

        @saveChanges = =>
            @mapsaving=true
            @$broadcast 'save.demand'
    ]

    exports.Map = ngcontroller ['Map',  '$location', (Map, $loc)->
        @maploading = false
        @loc        = {x: 0, y: 0}
        @fields     = {}
        @step       = 0
        @changes    = {}

        @$on '$locationChangeStart', (ev)=>
            if @has_changes and !Alcarin.Dialogs.Confirms.admin 'You lost your unsaved changes! You are sure?'
                ev.preventDefault()

        @$on '$routeChangeSuccess', (e, route)=>
            @loc.x = parseInt route.params.x
            @loc.y = parseInt route.params.y
            @$emit 'map.reset'
            @fetchFields()

        @dragMap = (offsetx, offsety)->
            # if not @has_changes or
            #  Alcarin.Dialogs.Confirms.admin 'You will lost all unsaved changes. Are you sure you want to continue?'
            @loc.x += Math.round offsetx * (@step - 1)
            @loc.y += Math.round offsety * (@step - 1)
            $loc.path "/x=#{@loc.x}&y=#{@loc.y}" if @loc?

        @fetchFields = =>
            @maploading = true
            Map.fetch @loc.x, @loc.y, (result)=>
                @step       = result.size
                @fields     = result.fields
                @maploading = false

        @$on 'save.demand', =>
            Map.update @changes, =>
                @$parent.mapsaving = false
                @$emit 'map.reset'


        @mapChange = =>
            @$emit 'map.changed'
    ]