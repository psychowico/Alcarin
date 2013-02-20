<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Admin;

use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\Mvc\ModuleRouteListener;
use Core\GameModuleInterface;

class Module implements AutoloaderProviderInterface, GameModuleInterface
{
    public function getGameModuleDescription()
    {
        return 'AdminMain';
    }

    /**
     * game module can extend game objects on some plugins - this method return
     * array of ['Full\GameObject\Class' => ['plugin1' => $plugin1]] - assigns array
     * of plugins to specific game object class.
     */
    public function getGameObjectsPlugins()
    {
        return [
            'EngineBase\GameObject\Player' => [
                'admin' => 'Admin\GameObject\Extension\PlayerAdmin'
            ],
            'Admin\GameObject\Extension\PlayerAdmin' => [
                'privilages' => 'Admin\GameObject\Extension\AdminPrivilages',
            ],
        ];
    }

    /**
     * game module can extend game service on new gameobjects - this method return
     * array of ['game-object-alias' => $factory_or_invokable] - assigns array
     * of gameobject aliases and factory method/invokable class string.
     */
    public function getGameObjects()
    {
        return [];
    }

    /**
     * Expected to return \Zend\ServiceManager\Config object or array to
     * seed such an object.
     *
     * @return array|\Zend\ServiceManager\Config
     */
    public function getServiceConfig()
    {
        return array(
            'invokables' => array(
                'user-admin' => 'Admin\Model\UserAdministrationModel',
            ),
        );
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    // if we're in a namespace deeper than one level we need to fix the \ in the path
                    __NAMESPACE__ => __DIR__ . '/src/' . str_replace('\\', '/' , __NAMESPACE__),
                ),
            ),
        );
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }
}
