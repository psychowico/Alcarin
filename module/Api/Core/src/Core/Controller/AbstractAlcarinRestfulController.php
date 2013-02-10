<?php
/**
 * Created by psychowico, 30.04.12.
 */

namespace Core\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;

/***
 * default abstract controller, base class for most controllers in "Everest" module.
 *
 * @author Wiktor Obrębski
 */
abstract class AbstractAlcarinRestfulController extends AbstractRestfulController
{
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
}
