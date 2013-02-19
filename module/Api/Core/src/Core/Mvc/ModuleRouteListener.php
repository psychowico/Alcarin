<?php
namespace Core\Mvc;

class ModuleRouteListener extends \Zend\Mvc\ModuleRouteListener
{
    /**
     * Listen to the "route" event and determine if the module namespace should
     * be prepended to the controller name.
     *
     * If the route match contains a parameter key matching the MODULE_NAMESPACE
     * constant, that value will be prepended, with a namespace separator, to
     * the matched controller parameter.
     *
     * Additionaly to default ModuleRouteListener it can use namespaces mapping.
     *
     * @param  MvcEvent $e
     * @return null
     */
    public function onRoute(\Zend\Mvc\MvcEvent $e)
    {
        $matches = $e->getRouteMatch();

        if (!$matches instanceof \Zend\Mvc\Router\RouteMatch) {
            // Can't do anything without a route match
            return;
        }

        $module = $matches->getParam(self::MODULE_NAMESPACE, false);
        if (!$module) {
            // No module namespace found; nothing to do
            return;
        }

        $router_config  = $e->getApplication()->getConfig()['router'];
        $route_name = $matches->getMatchedRouteName();
        if( !empty($router_config['namespaces'][$route_name][$module]) ) {
            $matches->setParam(self::MODULE_NAMESPACE, $router_config['namespaces'][$route_name][$module]);
        }

        return parent::onRoute($e);
    }
}
