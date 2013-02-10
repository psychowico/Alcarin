<?php

namespace Core\Mvc\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;

/**
 * base controller for API modules controllers. it implements empty
 * RESTful controller methods (to avoid exceptions when we want use
 * only piece of methods).
 * It provide frequently used properties too.
 */
abstract class AbstractAlcarinRestfulController extends AbstractRestfulController
{
    private $gameServiceContainer = null;

    /**
     * shortcut to GameServiceContainer class.
     */
    public function gameService( $service_key = null, $service_closure = null )
    {
        if( $this->gameServiceContainer == null ) {
            $this->gameServiceContainer = $this->getServiceLocator()->get('game-services');
        }

        if( $service_key === null ) return $this->gameServiceContainer;

        if( $service_closure == null ) {
            return $this->gameServiceContainer->get( $service_key );
        }
        return $this->getServiceContainer()->set( $service_key, $service_closure );
    }

    public function getList()
    {
    }

    public function get( $id )
    {
    }

    public function create( $data )
    {
    }

    public function update( $id, $data )
    {
    }

    public function delete( $id )
    {
    }
}
