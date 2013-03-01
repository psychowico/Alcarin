<?php

namespace Core\Mvc\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Zend\View\Model\JsonModel;

/**
 * simple plugin to avoid adding Zend\View\Model\JsonModel to use all the times.
 */
class Json extends AbstractPlugin
{
    public function fail($additional_data = null)
    {
        $data = ['success' => false];
        if(!empty($additional_data)) {
            $data += $additional_data;
        }
        return new JsonModel($data);
    }

    public function success($additional_data = null)
    {
        $data = ['success' => true];
        if(!empty($additional_data)) {
            $data += $additional_data;
        }
        return new JsonModel($data);
    }


    public function __invoke( $array = null )
    {
        if($array == null) return $this;

        return new JsonModel($array);
    }
}