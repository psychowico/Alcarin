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
        return ['gateway_form' => $this->getForm()];
    }

    protected function getForm()
    {
        $form_prototype = new \Admin\Form\EditGatewayForm();
        $builder = new \Core\Service\AnnotationBuilderService();
        return $builder->createForm($form_prototype, 'Save');
    }
}