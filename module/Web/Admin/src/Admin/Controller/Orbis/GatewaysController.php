<?php

namespace Admin\Controller\Orbis;

use Core\Controller\AbstractAlcarinRestfulController;

class GatewaysController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        $gateways_data = $this->orbis()->gateways()->find();
        return $this->json($gateways_data);
    }

    public function get($id)
    {
        $data = $this->orbis()->gateways()->get($id);
        return $this->json($data);
    }

    public function create($gateway)
    {
        $form = $this->getServiceLocator()->get('gateways-form');
        $form->setData($gateway);

        if($form->isValid()) {
            $data = $form->getData();

            $result_id = $this->orbis()->gateways()->insert(
                $data['name'], $data['description'],
                $data['loc']['x'], $data['loc']['y'], $data['group']);

            if($result_id !== false) {
                $data['id'] = $result_id;
                return $this->json($data);
            }
            return $this->responses()->internalServerError();
        }

        return $this->responses()->badRequest();
    }

    public function update($id, $gateway)
    {
        $form = $this->getServiceLocator()->get('gateways-form');

        $form->setData($gateway);

        if($form->isValid()) {
            $new_data = $form->getData();

            $this->orbis()->gateways()->update($id,
                $new_data['name'], $new_data['description'],
                $new_data['loc']['x'], $new_data['loc']['y'], $new_data['group'] );
            return $this->json($new_data);
        }
        return $this->responses()->badRequest();
    }

    public function delete($id)
    {
        if($this->orbis()->gateways()->delete($id)) {
            return $this->responses()->OK();
        }
        else {
            return $this->responses()->internalServerError();
        }
    }

    protected function orbis()
    {
        return $this->gameServices()->get('orbis');
    }
}