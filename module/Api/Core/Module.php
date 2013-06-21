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
use Zend\Stdlib\ArrayUtils;
use Zend\Http\PhpEnvironment\Request as HttpRequest;
use Zend\Session\SessionManager;
use Zend\Session\Container;


/**
 * alcarin system core module, should contains classes that will be shared between
 * system api modules.
 */
class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $sm = $e->getApplication()->getServiceManager();

        //before controller are choose
        if( ($request = $e->getRequest()) instanceof HttpRequest) {
            $eventManager = $e->getApplication()->getEventManager();
            $eventManager->attach( MvcEvent::EVENT_ROUTE , array( $this, 'setupAccessSystem' ), -100 );

            $this->setupRestfulStandard($sm, $request);

            $sharedEvents = $eventManager->getSharedManager();
            $injectTemplateListener = new \Core\Mvc\View\Http\InjectTemplateListener();
            $sharedEvents->attach('Zend\Stdlib\DispatchableInterface', MvcEvent::EVENT_DISPATCH, array($injectTemplateListener, 'injectTemplate'), -81);
        }

        $this->setupGameModulesSystem($sm);
        $this->bootstrapSession($e);
    }


    protected function setupGameModulesSystem($sm)
    {
        //let register all gameobject and gameobject extensions
        //provided by GameModule's

        $game_services = $sm->get('game-services');

        $config = [];
        $global_config = $sm->get('config');
        if( isset($global_config['game-modules']) ){
            $config = ArrayUtils::merge($config, $global_config['game-modules']);
        }

        $modules = $sm->get('ModuleManager')->getLoadedModules();
        foreach($modules as $module) {
            if(method_exists($module, 'getGameModuleConfig')){
                $config = ArrayUtils::merge($config, $module->getGameModuleConfig());
            }
        }

        foreach($config as $module_key => $module_config) {
            $game_services->registerGameModule($module_key, $module_config);
        }

        $sm->get('system-logger')->debug('Game objects and plugins plugged.');
    }

    public function bootstrapSession($e)
    {
        $session = $e->getApplication()
                     ->getServiceManager()
                     ->get('Zend\Session\SessionManager');
        $session->start();

        $container = new Container('initialized');
        if (!isset($container->init)) {
             $session->regenerateId(true);
             $container->init = 1;
        }
    }


    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                //sharing mongo
                'mongo' => function( $sm ) {
                    //ini_set('mongo.native_long', 1);
                    //ini_set('mongo.long_as_object', 1);

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
                    $db = \DevPack\MongoDatabase::instance('mongo', $config );
                    if( isset( $profiler ) ) {
                        $db->set_profiler( [$profiler, 'start'], [$profiler, 'stop'] );
                    }
                    return $db;
                },
                # default session initalization from zf2 docs
                'Zend\Session\SessionManager' => function ($sm) {
                    $config = $sm->get('config');
                    if (isset($config['session'])) {
                        $session = $config['session'];

                        $sessionConfig = null;
                        if (isset($session['config'])) {
                            $class = isset($session['config']['class'])  ? $session['config']['class'] : 'Zend\Session\Config\SessionConfig';
                            $options = isset($session['config']['options']) ? $session['config']['options'] : array();
                            $sessionConfig = new $class();
                            $sessionConfig->setOptions($options);
                        }

                        $sessionStorage = null;
                        if (isset($session['storage'])) {
                            $class = $session['storage'];
                            $sessionStorage = new $class();
                        }

                        $sessionSaveHandler = null;
                        if (isset($session['save_handler'])) {
                            // class should be fetched from service manager since it will require constructor arguments
                            $sessionSaveHandler = $sm->get($session['save_handler']);
                        }

                        $sessionManager = new SessionManager($sessionConfig, $sessionStorage, $sessionSaveHandler);

                        if (isset($session['validators'])) {
                            $chain = $sessionManager->getValidatorChain();
                            foreach ($session['validators'] as $validator) {
                                $validator = new $validator();
                                $chain->attach('session.validate', array($validator, 'isValid'));

                            }
                        }
                    } else {
                        $sessionManager = new SessionManager();
                    }
                    Container::setDefaultManager($sessionManager);
                    return $sessionManager;
                },
                'Zend\Session\SaveHandler\MongoDB' => function($sm) {
                    $config = $sm->get('config')['session']['save_handler_options'];

                    $mongo = $sm->get('mongo')->exposeMongoObject();
                    $options = new \Zend\Session\SaveHandler\MongoDBOptions($config);
                    $mongo_handler = new \Core\Session\SaveHandler\MongoDBExt($mongo, $options);
                    $mongo_handler->setServicesContainer($sm->get('game-services'));
                    return $mongo_handler;
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
                    $plugin = new \Core\Mvc\Controller\Plugin\IsAllowed();
                    $plugin->setAuthService( $sm->getServiceLocator()->get('auth-service') );
                    return $plugin;
                }
            ),
        );
    }

    /**
     * before controller choose we check privilages for current.
     */
    public function setupAccessSystem( MvcEvent $event )
    {
        $sm = $event->getApplication()->getServiceManager();
        $logger = $sm->get('system-logger');

        $route_match = $event->getRouteMatch();
        $choosed = $route_match->getParam('controller');

        $logger->debug(sprintf('Checking access for "%s".', $choosed));

        //if logged user not have privilages to any of needed
        //resources, we render for him 'notallowed' site.
        $authService = $sm->get('auth-service');
        if( !$authService->isAllowedToController( $choosed ) ) {
            $logger->debug('--- Refuse ---');
            $not_allowed_route_params = $sm->get('config')['controllers_access']['notallowed_route'];
            foreach ($not_allowed_route_params as $name => $value) {
                $route_match->setParam( $name, $value);
            }
            $event->getResponse()->setStatusCode(401);
            //let set redirect value
            $original_uri = $event->getRequest()->getServer( 'REQUEST_URI' );
            $event->getRequest()->getQuery()->set('redirect', $original_uri);
            $event->getRequest()->setMethod('get');
        }
        else {
            $logger->debug('--- Granted ---');
        }
    }

    /**
     * we setup default way to handle "DELETE" and "PUT" restful
     * request (because they are unsupported by default html)
     *
     * @param $request \Zend\Http\Request
     */
    private function setupRestfulStandard( $sm, $request )
    {
        //we don't run this in specific situation, like console runing scripts
        if( $request instanceof \Zend\Http\Request ) {
            $log = $sm->get('system-logger');
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
            else {
                $_method = Request::METHOD_GET;
            }

            $debug_msg = sprintf('%s, %s', $_method, $request->getRequestUri() );
            $log->debug( $debug_msg );
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
