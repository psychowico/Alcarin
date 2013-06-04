<?php
namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\Mvc\Router\RouteMatch;

class AdminHomeController extends AbstractAlcarinRestfulController
{
    protected $filter = null;
    protected $admin_pages = [
        [
            'controller' => 'users',
            'title'      => 'Manage players',
            'icon'       => 'icon-search',
        ],
        [
            'controller' => 'translations',
            'title'      => 'Translate Panel',
            'icon'       => 'icon-book',
        ],
        [
            'controller' => 'GatewaysPanel',
            'namespace'  => 'Admin\Controller\Orbis',
            'route'      => 'orbis',
            'title'      => '"Orbis" Editor',
            'icon'       => 'icon-globe',
        ],
        [
            'controller' => 'modules',
            'title'      => 'Manage modules',
            'icon'       => 'icon-search',
        ]
    ];

    public function getList()
    {
        $result = [];
        $authService = $this->isAllowed();
        foreach( $this->admin_pages as $data ) {
            $controller = $data['controller'];
            $namespace = empty($data['namespace']) ? 'Admin\\Controller' : $data['namespace'];
            $full_controller = $namespace . '\\' . ucfirst($controller);

            if( $authService->isAllowedToController($full_controller) || true ) {
                $result[$controller] = $this->pageData( $data );
            }
        }

        return [ 'pages' => $result ];
    }

    private function routeFilter()
    {
        if($this->filter == null) {
            $filter = new \Zend\Filter\FilterChain();
            $filter->attach(new \Zend\Filter\Word\CamelCaseToDash());
            $filter->attach(new \Zend\Filter\StringToLower());
            $this->filter = $filter;
        }
        return $this->filter;

    }

    private function pageData( $data ) {
        $route_name = empty($data['route']) ? 'admin/default' : $data['route'];
        $controller = $this->routeFilter()->filter($data['controller']);
        return [
            'href' => $this->url()->fromRoute( $route_name, [ 'controller' => $controller ] ),
            'icon' => empty( $data['icon'] ) ? null : $data['icon'],
            'title'  => empty( $data['title'] ) ? null : $data['title'],
        ];
    }
}
