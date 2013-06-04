<?php
/**
 * users administration
 */

namespace Admin\Controller\Orbis;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\View\Model\ViewModel;
use Zend\InputFilter\Input;

class GatewaysPanelController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        return [
            'gateway_form' => $this->getServiceLocator()->get('gateways-form'),
            'radius' => $this->orbis()->minimap()->properties()->radius(),
        ];
    }


    private function orbis()
    {
        return $this->gameServices()->get('orbis');
    }
}