<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Alcarin;

use Core\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Http\PhpEnvironment\Request as HttpRequest;

/**
 * main web module provided web-site that using game web api
 */
class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $e->getApplication()->getServiceManager()->get('translator');

        //this code is neccesery for working routing "per module".
        //it is enough if it in one place in application
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        if( ($request = $e->getRequest()) instanceof HttpRequest) {
            $eventManager->attach( MvcEvent::EVENT_ROUTE , array( $this, 'setupEventsProxySystem' ), -100 );
        }
    }

    public function setupEventsProxySystem(MvcEvent $e)
    {
        $route_match = $e->getRouteMatch();

        $params = $e->getRequest()->getPost();
        $__action = $params->get('__action', null);

        if($__action == 'emit' && isset($params['__id'])) {
            $route_match = $e->getRouteMatch();
            unset($params['__action']);
            $route_match->setParam('action', 'on');
        }
    }

    public function getViewHelperConfig()
    {
        return array(
            'factories' => array(
                'isAllowed' => function( $sm ) {
                    //can be helpful in modules to checking user privilages to specific resources
                    $helper = new \Alcarin\View\Helper\IsAllowed();
                    $helper->setAuthService( $sm->getServiceLocator()->get('auth-service') );
                    return $helper;
                },
            ),
            'aliases' => array(
                'authService' => 'isAllowed',
            )
        );
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }
}