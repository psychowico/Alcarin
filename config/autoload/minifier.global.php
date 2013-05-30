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
                            '/js/vendor/jquery/jquery-1.9.1.js',
                            '/js/vendor/jquery/jquery.ba-bbq-1.4pre.js',
                            '/js/vendor/jquery/jquery.cookie-1.3.1.js',
                            '/js/vendor/jquery/jquery.ui-1.10.2.js',
                            '/js/vendor/jquery/chosen.jquery-0.9.12.js',
                            '/js/vendor/angular-1.1.5.js',
                            '/js/vendor/bootstrap/bootstrap-2.3.1.js',
                            '/js/vendor/bootstrap/bootstrap-editable-1.4.1.js',
                            '/js/vendor/stacktrace-0.5.js',
                            '/js/vendor/spin-1.2.8.js',
                            '/js/vendor/bootstrap/bootstrap-colorpicker.js',
                            '/js/vendor/rot-0.4.js',
                        ),
                    ),
                    'common'    => array(
                        'sources' => array(
                            '/js/compiled_coffee/core.js',
                            '/js/compiled_coffee/auto-load-plugins.js',
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
                            '/js/compiled_coffee/Alcarin/Angular/zf2-proxy.js',
                            '/js/compiled_coffee/Alcarin/Angular/ng-chosen.js',
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
                            '/js/compiled_coffee/Admin/translations.js',
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
                            '/css/vendor/bootstrap/bootstrap-2.3.1.css',
                            '/css/vendor/bootstrap/bootstrap-responsive-2.3.1.css',
                            '/css/vendor/bootstrap/bootstrap-editable-1.4.1.css',
                            '/css/vendor/bootstrap/bootstrap-colorpicker.css',
                            '/css/vendor/jquery.ui-1.10.2.css',
                            '/css/vendor/chosen-0.9.12.css',
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