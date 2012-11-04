<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Admin\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class AdminHomeController extends AbstractActionController
{
    protected $admin_pages = [
        'controller1',
        'controller2',
        'controller3',
        'controller4',
        'controller5',
        'controller6',
        'controller7',
        'controller8',
    ];

    public function indexAction()
    {
        $result = [];
        $authService = $this->isAllowed();
        foreach( $this->admin_pages as $controller ) {
            if( $authService->isAllowedToController( $controller ) ) {
                $result[$controller] = $this->url()->fromRoute( 'admin',
                    [ 'controller' => $controller ] );
            }
        }
        return [ 'pages' => $result ];
    }

    public function fooAction()
    {
        // This shows the :controller and :action parameters in default route
        // are working when you browse to /module-specific-root/skeleton/foo
        return [];
    }
}
