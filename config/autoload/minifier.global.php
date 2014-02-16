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
                            // '/js/vendor/angularjs/angular-1.1.5.js',
                        ),
                        'directories' => array(
                            '/js/vendor',
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
                            '/js/compiled_coffee/Alcarin/Map/painter.js',
                        ),
                        'directories' => array(
                            '/js/compiled_coffee/Alcarin/Angular',
                            '/js/compiled_coffee/Dialogs'
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
                        ),
                        'directories' => array(
                            '/js/compiled_coffee/Orbis',
                            '/js/compiled_coffee/Admin'
                        ),
                    ),
                    # files for regular players
                    'player' => array(
                        'sources' => array(
                            '/js/compiled_coffee/Alcarin/Game/Services/ngx-game-server.js',
                            '/js/compiled_coffee/Alcarin/Game/Directives/Map/ngx-map-module.js',
                            '/js/compiled_coffee/Alcarin/Game/Services/char-environment.js',
                        ),
                        'directories' => array(
                            '/js/compiled_coffee/Alcarin/Game',
                        ),
                    ),
                ),
            ),
            'css'    => array(
                'output_dir' => '/css/bundles',
                'list'       => array(
                    'external'  => array(
                        'sources'   => array(
                        ),
                        'directories' => array(
                            '/css/vendor/',
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
                        ),
                        'directories' => array(
                            '/css/compiled_less/admin',
                        ),
                    ),
                    //files for regular players
                    'player' => array(
                        'sources' => [],
                        'directories' => array(
                            '/css/compiled_less/player',
                        ),
                    ),
                ),
            ),
        ),
    ),
);
