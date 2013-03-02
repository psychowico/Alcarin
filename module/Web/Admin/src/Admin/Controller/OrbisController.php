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
            'gateway_form' => $this->getForm()
        ];
    }

    protected function getForm($with_defaults = true)
    {
        $form_prototype = new \Admin\Form\EditGatewayForm();
        $builder = $this->getServiceLocator()->get('AnnotationBuilderService');
        return $builder->createForm($form_prototype, $with_defaults, 'Save');
    }

}