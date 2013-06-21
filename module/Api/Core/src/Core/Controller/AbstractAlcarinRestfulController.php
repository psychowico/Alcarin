<?php
/**
 * Created by psychowico, 30.04.12.
 */

namespace Core\Controller;

use Zend\Mvc\Controller\AbstractRestfulController,
    Zend\Mvc\MvcEvent;

/***
 * default abstract controller, base class for most controllers in "Everest" module.
 *
 * @author Wiktor Obrębski
 */
abstract class AbstractAlcarinRestfulController extends AbstractRestfulController
{
    protected $mongo;
    protected $game_services;

    /**
     * Debug temporary default action, "Return list of resources", it shouldn't be
     * called, it's used only for mute debug message about abstract functions
     *
     * @return mixed|void
     * @throws \LogicException when we use this method explicitly
     */
    public function getList()
    {
        $className = get_class( $this );
        $type = 'GET';
        throw new \LogicException("Method '$type' in controller '$className' isn't implemented yet.");
    }
    /**
     * Debug temporary default action, "Return single resource", it shouldn't be
     * called, it's used only for mute debug message about abstract functions
     *
     * @param  mixed $id
     * @return mixed
     * @throws \LogicException when we use this method explicitly
     */
    public function get( $id )
    {
        $className = get_class( $this );
        $type = 'GET/id';
        throw new \LogicException("Method '$type' in controller '$className' isn't implemented yet.");
    }
    /**
     * Create a new resource, virtual method
     *
     * @param  mixed $data
     * @throws \LogicException
     * @return mixed
     */
    public function create( $data )
    {
        $className = get_class( $this );
        $type = 'POST';
        throw new \LogicException("Method '$type' in controller '$className' isn't implemented yet.");
    }
    /**
     * Update an existing resource, virtual method
     *
     * @param  mixed $id
     * @param  mixed $data
     * @throws \LogicException
     * @return mixed
     */
    public function update( $id, $data )
    {
        $className = get_class( $this );
        $type = 'PUT';
        throw new \LogicException("Method '$type' in controller '$className' isn't implemented yet.");
    }

    /**
     * Delete an existing resource, virtual method
     * @param mixed $id
     * @return mixed|void
     * @throws \LogicException
     */
    public function delete( $id )
    {
        $className = get_class( $this );
        $type = 'DELETE';
        throw new \LogicException("Method '$type' in controller '$className' isn't implemented yet.");
    }

    //we want throw notices and warnings as exceptions
    //so we can easly debuging ajax controllers
    public function custom_warning_handler($errno, $errstr) {
        throw new \Exception($errstr);
    }

    /**
     * Transform an "template" token into a method name
     *
     * @param  string $action
     * @return string
     */
    private static function getMethodFromTemplate($action)
    {
        $method  = str_replace(array('.', '-', '_'), ' ', $action);
        $method  = ucwords($method);
        $method  = str_replace(' ', '', $method);
        $method  = lcfirst($method);
        $method .= 'Template';

        return $method;
    }

    public function onDispatch(MvcEvent $e)
    {
        if($this->isJson()) {
            set_error_handler([$this, 'custom_warning_handler'], E_NOTICE | E_WARNING);
        }

        $routeMatch = $e->getRouteMatch();
        $action   = $routeMatch->getParam('action', false);
        $template = $routeMatch->getParam('template', false);
        $charid   = $routeMatch->getParam('charid', false);

        # I need think where is the best place to manage charid
        if($charid !== false) {
            $has_belong_to_player = $this->player()->chars()->belong($charid);
            if(!$has_belong_to_player) return $this->redirect()->toRoute('alcarin');
            $char = $this->player()->chars()->get($charid);
            $this->player()->setCurrentChar($char);
            $routeMatch->setParam('id', $charid);
        }

        if($template) {
            $response = $e->getResponse();
            //automatic cache angularjs template files
            $response->getHeaders()
                     ->addHeaderLine('Cache-Control: max-age=290304000, public');
            $meth = static::getMethodFromTemplate($template);

            $result = [];
            if(method_exists($this, $meth)) {
                $result = $this->{$meth}();
            }
            $e->setResult($result);
            return $result;
        }
        else {
            try {
                $result = parent::onDispatch($e);
            }
            catch( \Exception $exc ) {
                if(!$this->isJson()) throw $exc;

                $excrrors = [];
                while($exc !== null) {
                    $_errors = [$exc->getMessage()];

                    if(defined('DEBUG')) {
                        foreach(explode("\n", $exc->getTraceAsString()) as $line) {
                            $_errors []= $line;
                        }
                    }
                    $errors []= $_errors;
                    $exc = $exc->getPrevious();
                }

                $result = $this->json()->fail(['errors' => $errors]);
                $e->setResult($result);
                $e->getResponse()->setStatusCode(500);
            }

            if (!$action) {
                $routeMatch->setParam( 'action', 'index' );
            }
        }

        if($this->isJson()) {
            restore_error_handler();
        }
        return $result;
    }

    protected function mongo()
    {
        if( $this->mongo == null ) {
            $this->mongo = $this->getServiceLocator()->get('mongo');
        }

        return $this->mongo;
    }

    protected function gameServices()
    {
        if( $this->game_services == null ) {
            $this->game_services = $this->getServiceLocator()->get('game-services');
        }

        return $this->game_services;
    }

    public function player()
    {
        return $this->gameServices()->get('players')->current();
    }
}
