<?php
/**
 * users administration
 */

namespace Admin\Controller\Orbis;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\View\Model\ViewModel;
use Zend\InputFilter\Input;

class WorldEditorController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        return [
            'radius' => $this->orbis()->minimap()->properties()->radius(),
        ];
    }

    public function gatewayEditTemplate()
    {
        return [
            'form' => $this->getServiceLocator()->get('gateways-form'),
        ];
    }


    private function orbis()
    {
        return $this->gameServices()->get('orbis');
    }
}