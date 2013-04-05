<?php
/**
 * users administration
 */

namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\View\Model\ViewModel;
use Zend\InputFilter\Input;

class OrbisController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        return [
            'gateway_form' => $this->getServiceLocator()->get('gateways-form'),
            'radius' => $this->orbis()->minimap()->properties()->radius(),
            'radius_form' => $this->getRadiusForm(),
        ];
    }


    private function orbis()
    {
        return $this->gameServices()->get('orbis');
    }

    public function create($data)
    {
        //we block option for changing global map radius.
        //changing radius is related with global mongo geo indexes
        //min and max coords values. it shouldn't be easly done, without
        //programmers support - because it can give our much troubles.
        //changing indexes, when we will have many fields, can be very
        //time-consuming.

        // $form = $this->getRadiusForm();
        // $form->setData($data);

        // if($form->isValid()) {
        //     $new_radius = $form->getData()['radius'];
        //     $this->orbis()->minimap()->properties()->set('radius', $new_radius);
        // }
        return $this->redirect()->toSelf();
    }

    private function getRadiusForm()
    {
        $radius = $this->orbis()->minimap()->properties()->radius();
        $form = new \Zend\Form\Form('radius-form');
        $form->add([
            'name' => 'radius',
            'type' => 'text',
            'options' => [
                'label'=> 'World radius:',
                'twb' => [
                    'help-inline' => $radius / 10 . 'km',
                ],
            ],
            'attributes' => [
                'min'   => $radius,
                'value' => $radius,
                'autocomplete' => 'off',
            ],
        ]);

        $radius_validator = new \Zend\Validator\GreaterThan(['min' => $radius]);

        $input = new Input('radius');
        $input->getValidatorChain()->addValidator($radius_validator);

        $filters = $form->getInputFilter()->add($input);

        return $form;
    }
}