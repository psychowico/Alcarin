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

        $this->setupRestfulStandard( $e->getRequest() );
    }

    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                //sharing mongo
                'mongo' => function( $sm ) {
                    $config = $sm->get('config')['mongo'];

                    $db = \Mongo_Database::instance('mongo', $config );
                    if( !empty( $config['profiling'] ) ) {
                        $profiler = $sm->get('mongo_profiler');
                        $db->set_profiler( [$profiler, 'start'], [$profiler, 'stop'] );
                    }
                    return $db;
                },
            )
        );
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
        if( $request instanceof Request ) {
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


    public function onRender( MvcEvent $e )
    {
        if( $e->getRequest() instanceof \Zend\Http\Request ) {
            $this->turnOffJsonNest( $e );
        }
    }

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
