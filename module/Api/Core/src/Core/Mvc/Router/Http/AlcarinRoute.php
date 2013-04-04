<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/zf2 for the canonical source repository
 * @copyright Copyright (c) 2005-2013 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Core\Mvc\Router\Http;

use Traversable;
use Zend\Mvc\Router\Exception;
use Zend\Stdlib\ArrayUtils;
use Zend\Stdlib\RequestInterface as Request;
use Zend\Mvc\Router\Http\RouteInterface;
use Zend\Mvc\Router\Http\RouteMatch;
use Zend\Mvc\Router\Http\Part;
use Zend\Mvc\Router\Http\Literal;

/**
 * Alcarin route. it extends Literal so not need to implement all default route methods.
 * we use only static factory method.
 *
 * @see        http://guides.rubyonrails.org/routing.html
 */
class AlcarinRoute extends Literal
{
    public static function routePluginsManager()
    {
        $routePlugins = new \Zend\Mvc\Router\RoutePluginManager();
        $plugins = array(
            'literal' => 'Zend\Mvc\Router\Http\Literal',
            'part'    => 'Zend\Mvc\Router\Http\Part',
            'segment' => 'Zend\Mvc\Router\Http\Segment',
        );
        foreach ($plugins as $name => $class) {
            $routePlugins->setInvokableClass($name, $class);
        }

        return $routePlugins;
    }

    /**
     * factory(): defined by RouteInterface interface.
     *
     * @see    Route::factory()
     * @param  array|Traversable $options
     * @throws Exception\InvalidArgumentException
     * @return Literal
     */
    public static function factory($options = array())
    {
        $restmode = !empty($options['restmode']);

        if (!isset($options['namespace'])) {
            throw new Exception\InvalidArgumentException('Missing "namespace" in options array');
        }
        $namespace = $options['namespace'];
        $route    = $options['route'];

        $defaults = empty($options['defaults']) ? [] : $options['defaults'];

        $routePlugins = static::routePluginsManager();
        $children = array(
            'default' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => $restmode ? '[/:controller][/:id][/:action]' :
                                '[/:controller][/:action][/:id]',
                    'defaults' => $defaults,
                ),
                'constraints' => array(
                    'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                ),
            ),
        );
        if($restmode) {
            $children['subdefault'] = array(
                'type'    => 'Segment',
                'options' => array(
                    //in Alcarin module we using "ActionControllers", not RESTful
                    'route'    => '/:__NAMESPACE__/:id/:controller[/:action]',
                    'defaults' => [],
                    'constraints' => array(
                        '__NAMESPACE__' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'controller'    => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'            => '[a-zA-Z0-9_-]+',
                        'action'        => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                ),
            );
        }

        return Part::factory(array(
            'route' => array(
                'type' => 'literal',
                'options' => array(
                    'route' => $route,
                    'defaults' => array(
                        '__NAMESPACE__' => $namespace,
                    )
                ),
            ),
            'may_terminate' => false,
            'route_plugins' => $routePlugins,
            'child_routes' => $children,
        ));
    }
}
