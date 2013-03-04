<?php
/**
 * users administration
 */

namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;

class OrbisController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        return [
            'gateway_form' => $this->getServiceLocator()->get('gateways-form')
        ];
    }

}