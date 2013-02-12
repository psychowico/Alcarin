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
                            '/js/jquery/jquery-1.9.1.js',
                            '/js/jquery/jquery.ba-bbq-1.4pre.js',
                            '/js/jquery/jquery.cookie-1.3.1.js',
                            '/js/bootstrap-2.3.0.js',
                        ),
                    ),
                    //files enough for guest users
                    'guest' => array(
                        'sources' => array(
                            '/js/compiled_coffee/core.js',
                            '/js/compiled_coffee/Alcarin/active-view.js',
                            '/js/compiled_coffee/Alcarin/active-list.js',
                            '/js/compiled_coffee/Alcarin/Errors/errors-core.js',
                            '/js/compiled_coffee/Alcarin/game-events-proxy.js',
                            '/js/compiled_coffee/test.js',
                            '/js/compiled_coffee/Alcarin/JQueryPlugins/RESTful.js',
                        ),
                    ),
                    //files enough for admins
                    'admin' => array(
                        'sources' => array(
                            '/js/compiled_coffee/core.js',
                            '/js/compiled_coffee/test.js',
                        ),
                    ),
                    //files for regular players
                    'player' => array(
                        'sources' => array(
                            '/js/compiled_coffee/core.js',
                            '/js/compiled_coffee/test.js',
                        ),
                    ),
                ),
            ),
            'css'    => array(
                'output_dir' => '/css/bundles',
                'list'       => array(
                    'external'  => array(
                        'sources'   => array(
                            '/css/style.css',
                            '/css/bootstrap.css',
                            '/css/bootstrap-responsive.css',
                        ),
                    ),
                    'common' => array(
                        'sources' => array(
                            '/css/compiled_less/common.css',
                            '/css/compiled_less/user-bar.css',
                            '/css/compiled_less/player-panel.css',
                        ),
                    ),
                    'guest' => array(
                        'sources' => array(
                            '/css/compiled_less/middle-nav.css',
                        ),
                    ),
                    //files enough for admins
                    'admin' => array(
                        'sources' => array(
                            '/css/compiled_less/admin-index.css',
                            '/css/compiled_less/admin-users.css',
                        ),
                    ),
                    //files for regular players
                    'player' => array(
                        'sources' => '/css/compiled_less/test.css',
                    ),
                ),
            ),
        ),
    ),
);