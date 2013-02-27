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
        if($this->isJson()) {
            $orbis = $this->gameServices()->get('orbis');
            $grouped_gateways = $orbis->gateways()->find();

            return $this->json(['gateways' => $grouped_gateways]);
        }
        else {
            return [
                'gateway_form' => $this->getForm()
            ];
        }
    }

    protected function getForm()
    {
        $form_prototype = new \Admin\Form\EditGatewayForm();
        $builder = new \Core\Service\AnnotationBuilderService();
        return $builder->createForm($form_prototype, 'Save');
    }

    public function update($id, $data)
    {
        return $this->json([
            'success' => true,
        ]);
    }
}