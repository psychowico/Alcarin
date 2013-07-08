<?php

/**
 * js and css libraries that should be included in specific site bundles,
 * you dont need to use minifier file version - they will be minify in bundle
 * packing process.
 **/

return array(
    'minifier'    => array(
        'bundles'   => array(
            'js'    => array(
                'output_dir'     => '/js/bundles',
                'list'              => array(
                    'external'  => array(
                        'sources'   => array(
                            //because angularsjs cant be packed by default minifier config
                            //I moved it to common.layout directly - to time when I fix this
                            //issue
                            // '/js/vendor/jquery/jquery-1.9.1.js',
                            // '/js/vendor/angular-1.1.5.js',
                            '/js/vendor/jquery/jquery.cookie-1.3.1.js',
                            '/js/vendor/jquery/jquery.ui-1.10.2.js',
                            '/js/vendor/jquery/chosen.jquery-0.9.12.js',
                            '/js/vendor/angularjs/cookies-1.1.5.js',
                            '/js/vendor/angularjs/resource-1.1.5.js',
                            '/js/vendor/angularjs/utils-0.0.2.js',
                            '/js/vendor/bootstrap/bootstrap-2.3.1.js',
                            '/js/vendor/bootstrap/bootstrap-editable-1.4.4.js',
                            '/js/vendor/stacktrace-0.5.js',
                            '/js/vendor/spin-1.2.8.js',
                            '/js/vendor/bootstrap/bootstrap-colorpicker.js',
                            '/js/vendor/q-0.9.6.js',
                            '/js/vendor/rot-0.4.js',
                        ),
                    ),
                    'common'    => array(
                        'sources' => array(
                            '/js/compiled_coffee/core.js',
                            '/js/compiled_coffee/auto-load-plugins.js',
                            '/js/compiled_coffee/urls.js',
                            '/js/compiled_coffee/Alcarin/path.js',
                            '/js/compiled_coffee/Alcarin/events-emitter.js',
                            '/js/compiled_coffee/Alcarin/color.js',
                            '/js/compiled_coffee/Alcarin/randoms.js',
                            '/js/compiled_coffee/Alcarin/Errors/errors-core.js',
                            '/js/compiled_coffee/Alcarin/JQueryPlugins/others.js',
                            '/js/compiled_coffee/Dialogs/confirms.js',
                            '/js/compiled_coffee/Alcarin/Map/painter.js',
                            '/js/compiled_coffee/Alcarin/Map/Layers/terrain.js',
                            '/js/compiled_coffee/Alcarin/Angular/ngx-proxy.js',
                            '/js/compiled_coffee/Alcarin/Angular/ngx-core.js',
                            '/js/compiled_coffee/Alcarin/Angular/ngx-disabled.js',
                            '/js/compiled_coffee/Alcarin/Angular/ngx-chosen.js',
                            '/js/compiled_coffee/Alcarin/Angular/ngx-spin.js',
                            '/js/compiled_coffee/Alcarin/Angular/ngx-jquery-anims.js',
                            '/js/compiled_coffee/Alcarin/Angular/ngx-animate-in-place.js',
                            '/js/compiled_coffee/Alcarin/Angular/ngx-slider.js',
                            '/js/compiled_coffee/Alcarin/Angular/ngx-color-picker.js',
                        ),
                    ),
                    //files enough for guest users
                    'guest' => array(
                        'sources' => array(
                        ),
                    ),
                    //files enough for admins
                    'admin' => array(
                        'sources' => array(
                            '/js/compiled_coffee/Admin/Angular/ngx-popover.js',
                            '/js/compiled_coffee/Admin/Angular/ngx-x-editable.js',
                            '/js/compiled_coffee/Orbis/minimap-renderer.js',
                            '/js/compiled_coffee/Orbis/orbis.js',
                            '/js/compiled_coffee/Orbis/Gateways/ngx-gateways.js',
                            '/js/compiled_coffee/Admin/Map/Layers/editable-terrain.js',
                            '/js/compiled_coffee/Orbis/ngx-minimap-renderer.js',
                            '/js/compiled_coffee/Orbis/Gateways/gateways-list.js',
                            '/js/compiled_coffee/Orbis/Editor/ngx-map-manager.js',
                            '/js/compiled_coffee/Orbis/Editor/editor.js',
                            '/js/compiled_coffee/Admin/translations.js',
                        ),
                    ),
                    # files for regular players
                    'player' => array(
                        'sources' => array(
                            '/js/compiled_coffee/Alcarin/Game/ngx-game-events.js',
                            '/js/compiled_coffee/Alcarin/Game/socket.io-loader.js',
                            '/js/compiled_coffee/Alcarin/GameObject/factory.js',
                            '/js/compiled_coffee/Alcarin/GameObject/character.js',

                            '/js/compiled_coffee/Alcarin/Map/ngx-area-map.js',
                            '/js/compiled_coffee/Alcarin/Game/Views/home.js',
                            '/js/compiled_coffee/Alcarin/Game/game-panel.js',

                        ),
                    ),
                ),
            ),
            'css'    => array(
                'output_dir' => '/css/bundles',
                'list'       => array(
                    'external'  => array(
                        'sources'   => array(
                            '/css/vendor/bootstrap/bootstrap-2.3.1.css',
                            '/css/vendor/bootstrap/bootstrap-responsive-2.3.1.css',
                            '/css/vendor/bootstrap/bootstrap-editable-1.4.4.css',
                            '/css/vendor/bootstrap/bootstrap-colorpicker.css',
                            '/css/vendor/jquery.ui-1.10.2.css',
                            '/css/vendor/chosen-0.9.12.css',
                            '/css/vendor/animate-8429a2d.css',
                        ),
                    ),
                    'common' => array(
                        'sources' => array(
                            '/css/compiled_less/common.css',
                        ),
                    ),
                    'guest' => array(
                        'sources' => array(
                        ),
                    ),
                    //files enough for admins
                    'admin' => array(
                        'sources' => array(
                            '/css/compiled_less/admin/index.css',
                            '/css/compiled_less/admin/users.css',
                            '/css/compiled_less/admin/orbis.css',
                            '/css/compiled_less/admin/orbis-editor.css',
                            '/css/compiled_less/admin/help.css',
                            '/css/compiled_less/admin/translations.css',
                        ),
                    ),
                    //files for regular players
                    'player' => array(
                        'sources' => array(
                            '/css/compiled_less/middle-nav.css',
                            '/css/compiled_less/player-panel.css',
                        ),
                    ),
                ),
            ),
        ),
    ),
);