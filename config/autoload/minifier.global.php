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
                            '/js/jquery/jquery.ui-1.10.2.js',
                            '/js/bootstrap-2.3.1.js',
                            '/js/bootstrap-editable-1.4.1.js',
                            '/js/stacktrace-0.5.js',
                            '/js/spin-1.2.8.js',
                            '/js/bootstrap-colorpicker.js',
                            '/js/rot-0.4.js'
                        ),
                    ),
                    'common'    => array(
                        'sources' => array(
                            '/js/compiled_coffee/core.js',
                            '/js/compiled_coffee/urls.js',
                            '/js/compiled_coffee/Alcarin/path.js',
                            '/js/compiled_coffee/Alcarin/color.js',
                            '/js/compiled_coffee/Alcarin/randoms.js',
                            '/js/compiled_coffee/Alcarin/Errors/errors-core.js',
                            '/js/compiled_coffee/Alcarin/event-proxy.js',
                            '/js/compiled_coffee/Alcarin/active-view.js',
                            '/js/compiled_coffee/Alcarin/active-list.js',
                            '/js/compiled_coffee/Alcarin/update-hash-link.js',
                            '/js/compiled_coffee/Alcarin/JQueryPlugins/RESTful.js',
                            '/js/compiled_coffee/Alcarin/JQueryPlugins/forms.js',
                            '/js/compiled_coffee/Alcarin/JQueryPlugins/others.js',
                            '/js/compiled_coffee/Dialogs/confirms.js',
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
                            '/js/compiled_coffee/Orbis/gateways.js',
                            '/js/compiled_coffee/Orbis/minimap-renderer.js',
                            '/js/compiled_coffee/Orbis/orbis.js',
                            '/js/compiled_coffee/Orbis/Editor/map-manager.js',
                            '/js/compiled_coffee/Orbis/Editor/toolbar.js',
                            '/js/compiled_coffee/Orbis/Editor/editor.js',
                        ),
                    ),
                    //files for regular players
                    'player' => array(
                        'sources' => array(
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
                            '/css/bootstrap-2.3.1.css',
                            '/css/bootstrap-responsive-2.3.1.css',
                            '/css/bootstrap-editable-1.4.1.css',
                            '/css/bootstrap-colorpicker.css',
                            '/css/jquery.ui-1.10.2.css',
                        ),
                    ),
                    'common' => array(
                        'sources' => array(
                            '/css/compiled_less/common.css',
                            '/css/compiled_less/player-panel.css',
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
                        ),
                    ),
                    //files for regular players
                    'player' => array(
                        'sources' => array(
                            '/css/compiled_less/middle-nav.css',
                        ),
                    ),
                ),
            ),
        ),
    ),
);