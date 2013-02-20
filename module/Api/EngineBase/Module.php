<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace EngineBase;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\View\ViewEvent;
use Zend\View\Model\JsonModel;
use Zend\View\Renderer\JsonRenderer;
use Zend\Http\Request;
use Core\GameModuleInterface;

class Module implements GameModuleInterface
{
    /**
     * game module can extend game objects on some plugins - this method return
     * array of ['Full\GameObject\Class' => ['plugin1' => $plugin1]] - assigns array
     * of plugins to specific game object class.
     */
    public function getGameObjectsPlugins()
    {
        return [];
    }
    /**
     * game module can extend game service on new gameobjects - this method return
     * array of ['game-object-alias' => $factory_or_invokable] - assigns array
     * of gameobject aliases and factory method/invokable class string.
     */
    public function getGameObjects()
    {
        return [
            'players' => 'EngineBase\GameObject\Players',
        ];
    }

    public function getGameModuleDescription()
    {
        return "Base game objects with minimum functionality.";
    }

    public function getServiceConfig()
    {
        return array(
            'factories' => array(
            ),
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
