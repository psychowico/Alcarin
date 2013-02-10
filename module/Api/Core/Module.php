<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Core;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\View\ViewEvent;
use Zend\View\Model\JsonModel;
use Zend\View\Renderer\JsonRenderer;
use Zend\Http\Request;

/**
 * alcarin system core module, should contains classes that will be shared between
 * system api modules.
 */
class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager = $e->getApplication()->getEventManager();

        $eventManager->attach( MvcEvent::EVENT_RENDER, array( $this, 'onRender' ), -100 );
        //before controller are choose
        $eventManager->attach( MvcEvent::EVENT_ROUTE , array( $this, 'onPreRoute' ), -100 );

        $this->setupRestfulStandard( $e->getRequest() );

    }

    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                //sharing mongo
                'mongo' => function( $sm ) {
                    $config = $sm->get('config')['mongo'];

                    $profiler = null;
                    if( !empty( $config['profiling'] ) ) {
                        if( $sm->has( 'mongo_profiler' ) ) {
                            $profiler = $sm->get('mongo_profiler');
                        }
                        else {
                            $config['profiling'] = false;
                        }
                    }
                    $db = \Mongo_Database::instance('mongo', $config );
                    if( isset( $profiler ) ) {
                        $db->set_profiler( [$profiler, 'start'], [$profiler, 'stop'] );
                    }
                    return $db;
                },
                'logger' => function( $sm ) {
                    $logger = new \Zend\Log\Logger();
                    $plugins_manager = new \Zend\Log\WriterPluginManager();

                    $writers = $sm->get('config')['logs']['writers'];

                    //let register dedicated writers
                    foreach( $writers as $writer_key => $options ) {
                        $service = isset( $options['service'] ) ? $options['service'] : null;
                        if( $service == null ) continue;
                        if( !$plugins_manager->has( $service) ) {
                            $plugins_manager->setService($service, $sm->get( $service ) );
                        }
                    }
                    $logger->setWriterPluginManager( $plugins_manager );

                    //and add them as writers
                    foreach( $writers as $key => $options ) {
                        $logger->addWriter( $key, 1, $options );
                    }
                    return $logger;
                }
            )
        );
    }

    public function getControllerPluginConfig()
    {
        return array(
            'factories' => array(
                'isAllowed' => function( $sm ) {
                    //can be helpful in modules to checking user privilages to specific resources
                    $plugin = new \Core\Controller\Plugin\IsAllowed();
                    $plugin->setAuthService( $sm->getServiceLocator()->get('auth-service') );
                    return $plugin;
                }
            ),
        );
    }

    /**
     * //before controller choose we check privilages for current.
     */
    public function onPreRoute( MvcEvent $event )
    {
        $sm = $event->getApplication()->getServiceManager();

        $route_match = $event->getRouteMatch();
        $choosed = $route_match->getParam('controller');

        //if logged user not have privilages to any of needed
        //resources, we render for him 'notallowed' site.
        $authService = $sm->get('auth-service');
        if( !$authService->isAllowedToController( $choosed ) ) {
            $not_allowed_route_params = $sm->get('config')['controllers_access']['notallowed_route'];
            foreach ($not_allowed_route_params as $name => $value) {
                $route_match->setParam( $name, $value);
            }
            //let set redirect value
            $original_uri = $event->getRequest()->getServer( 'REQUEST_URI' );
            $event->getRequest()->getQuery()->set('redirect', $original_uri);
        }
    }

    public function onRender( MvcEvent $e )
    {
        if( $e->getRequest() instanceof \Zend\Http\Request ) {
            $this->turnOffJsonNest( $e );
        }
    }

    /**
     * we setup default way to handle "DELETE" and "PUT" restful
     * request (because they are unsupported by default html)
     *
     * @param $request \Zend\Http\Request
     */
    private function setupRestfulStandard( $request )
    {
        //we don't run this in specific situation, like console runing scripts
        if( $request instanceof \Zend\Http\Request ) {
            if( $request->isPost() ) {
                $_method = isset( $request->getPost()->_method ) ? $request->getPost()->_method :
                            Request::METHOD_POST;

                switch( $_method ) {
                    case Request::METHOD_PUT:
                        $request->setMethod(Request::METHOD_PUT);
                        $request->setContent(file_get_contents('php://input'));
                        break;
                    case Request::METHOD_DELETE:
                        $request->setMethod(Request::METHOD_DELETE);
                        break;
                }
            }
        }
    }

    /**
     * automatically turning off layouts for JSON requests.
     */
    private function turnOffJsonNest( MvcEvent $e )
    {
        $accept  = $e->getRequest()->getHeaders()->get('Accept');

        if (($match = $accept->match('application/json, application/javascript')) == false) {
            return;
        }

        if ($match->getTypeString() == 'application/json' ||
            $match->getTypeString() == 'application/javascript' ) {
            // application/json Accept header found
            foreach( $e->getViewModel()->getChildren() as $child ) {
                $child->setCaptureTo( null );
            }
        }
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
