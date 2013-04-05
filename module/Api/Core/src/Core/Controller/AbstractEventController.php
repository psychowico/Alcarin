<?php
/**
 * Created by psychowico, 30.04.12.
 */

namespace Core\Controller;

use Zend\Mvc\Controller\AbstractActionController,
    Zend\Mvc\MvcEvent;

/***
 * @author Wiktor Obrębski
 */
abstract class AbstractEventController extends AbstractActionController
{
    protected $mongo;
    protected $game_services;

    //we want throw notices and warnings as exceptions
    //so we can easly debuging ajax controllers
    public function custom_warning_handler($errno, $errstr) {
        throw new \Exception($errstr);
    }

    public function onDispatch(MvcEvent $e)
    {
        set_error_handler([$this, 'custom_warning_handler'], E_NOTICE | E_WARNING);

        $arr = ['test'];
        $route_match = $e->getRouteMatch();
        $action  = $route_match->getParam('action', false);

        $params = $this->getRequest()->getPost();

        $event_id = !empty($params['__id']) ? $params['__id'] : $route_match->getParam('id');
        if($event_id !== null){
            $params['__event'] = $event_id;
            if(isset($params['__id'])) unset($params['__id']);
            $route_match->setParam('action', 'on');
        }

        //auto format json errors
        try {
            $result = parent::onDispatch($e);
        }
        catch( \Exception $exc ) {
            if($this->isJson()) {
                $excrrors = [];
                while($exc !== null) {
                    $errors []= $exc->getMessage();
                    $exc = $exc->getPrevious();
                }
                if(count($errors) == 1) {
                    $errors = $errors[0];
                }

                $result = $this->emit('system.exception', [$errors]);
                $e->setResult($result);
            }
            else {
                throw $exc;
            }
        }

        return $result;
    }

    protected function on($event, $data)
    {
        return $this->emit('response.empty', ['event' => $event, 'data' => $data]);
    }

    public function onAction()
    {
        $data       = $this->params()->fromPost();
        $event_name = $data['__event'];

        $parts = array_map(function($part) { return ucfirst($part); },
                    explode('.', $event_name));
        $method_name = implode('', $parts);

        if(method_exists($this, 'on' . $method_name)) {
            unset($data['__event']);
            return $this->{'on'.$method_name}($data);
        }
        else if(method_exists($this, 'on')) {
            return $this->on($event_name, $data);
        }
        return $this->fail();
    }

    public function emit($event_name, $data = [])
    {
        return $this->json()->emit($event_name, $data);
    }

    public function success($data = [])
    {
        return array_merge(['success' => true], $data);
    }

    public function fail($data = [])
    {
        return array_merge(['success' => false], $data);
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
}
