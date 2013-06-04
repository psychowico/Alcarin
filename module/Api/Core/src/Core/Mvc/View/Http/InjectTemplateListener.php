<?php

namespace Core\Mvc\View\Http;

use Zend\EventManager\AbstractListenerAggregate;
use Zend\EventManager\EventManagerInterface as Events;
use Zend\Filter\Word\CamelCaseToDash as CamelCaseToDashFilter;
use Zend\Mvc\MvcEvent;
use Zend\Mvc\ModuleRouteListener;
use Zend\View\Model\ModelInterface as ViewModel;

class InjectTemplateListener extends \Zend\Mvc\View\Http\InjectTemplateListener
{
    /**
     * Inject a template into the view model, if none present
     *
     * Template is derived from the controller found in the route match, and,
     * optionally, the action, if present.
     *
     * @param  MvcEvent $e
     * @return void
     */
    public function injectTemplate(MvcEvent $e)
    {
        $model = $e->getResult();
        if (!$model instanceof ViewModel) {
            return;
        }

        $template = $model->getTemplate();
        if (!empty($template)) {
            return;
        }

        $routeMatch = $e->getRouteMatch();
        $controller = $e->getTarget();
        if (is_object($controller)) {
            $controller = get_class($controller);
        }
        if (!$controller) {
            $controller = $routeMatch->getParam('controller', '');
        }

        $module     = $this->deriveModuleNamespace($controller);

        if ($namespace = $routeMatch->getParam(ModuleRouteListener::MODULE_NAMESPACE)) {
            $controllerSubNs = $this->deriveControllerSubNamespace($namespace);

            if (!empty($controllerSubNs)) {
                if (!empty($module)) {
                    $module .= '/' . $controllerSubNs;
                } else {
                    $module = $controllerSubNs;
                }
            }
        }

        $controller = $this->deriveControllerClass($controller);
        $template   = $this->inflectName($module);

        if (!empty($template)) {
            $template .= '/';
        }
        $template  .= $this->inflectName($controller);

        //using "template" param to determine custom template to show
        $template_param     = $routeMatch->getParam('template', false);

        if($template_param) {
            $template .= '/' . $this->inflectName($template_param);
        }
        else {
            $action     = $routeMatch->getParam('action');
            if (null !== $action) {
                $template .= '/' . $this->inflectName($action);
            }
        }
        $model->setTemplate($template);
    }
}
