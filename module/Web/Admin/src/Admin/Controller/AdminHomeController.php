<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;

class AdminHomeController extends AbstractAlcarinRestfulController
{
    protected $admin_pages = [
        [
            'page'  => 'users',
            'controller' => 'Admin\Controller\Users',
            'title' => 'Manage players',
            'icon'  => 'icon-search',
        ],
        [
            'page'  => 'orbis',
            'controller' => 'Admin\Controller\Orbis\Orbis',
            'title' => '"Orbis" Editor',
            'icon'  => 'icon-globe',
        ],
    ];

    public function getList()
    {
        $result = [];
        $authService = $this->isAllowed();
        foreach( $this->admin_pages as $data ) {
            $page = $data['controller'];
            if( $authService->isAllowedToController($page) ) {
                $router = $this->getServiceLocator()->get('router');
                $url = '#';//$router->assemble( ['controller' => $page], ['name' => 'admin']);

                $result[$page] = $this->pageData( $data );
            }
        }
        return [ 'pages' => $result ];
    }

    private function pageData( $data ) {
        return [
            'href' => $this->url()->fromRoute( 'admin/default', [ 'controller' => $data['page'] ] ),
            'icon' => empty( $data['icon'] ) ? null : $data['icon'],
            'title'  => empty( $data['title'] ) ? null : $data['title'],
        ];
    }
}
