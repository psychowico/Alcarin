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
                $data['x'], $data['y'], $data['group']);

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
                $new_data['x'], $new_data['y'], $new_data['group'] );
            return $this->json($new_data);
        }
        return $this->responses()->badRequest();
    }

    public function delete($id)
    {
        if($this->orbis()->gateways()->delete($id)) {
            return $this->json();
        }
        else {
            return $this->responses()->internalServerError();
        }
    }

    protected function orbis()
    {
        return $this->gameServices()->get('orbis');
    }

    /*
    protected function onGroupCreate($data)
    {
        $form = $this->getServiceLocator()->get('gateways-form');
        $form->remove('CSRF');

        $form->setData($data);

        $result = null;
        if($form->isValid()) {
            $data = $form->getData();
            $gateway_name  = $data['name'];
            $gateway_group = empty($data['group']) ? null : $data['group'];


            $gateway_desc  = empty($data['description']) ? null : $data['description'];
            $x             = empty($data['x']) ? 0 : $data['x'];
            $y             = empty($data['y']) ? 0 : $data['y'];

            $result_id = $this->orbis()->gateways()->insert(
                $gateway_name, $gateway_desc,
                $x, $y, $gateway_group);
            if($result_id !== false) {
                $data['id'] = $result_id;
                $data = [
                  'gateway' => $data
                ];
                $result = $this->success($data);
            }
            else {
                $result = $this->fail();
            }
        }
        else {
            $result = $this->fail(['errors' => $form->getMessages()]);
        }
        return $this->emit('group.created', $result);
    }

    protected function onGroupDelete($data)
    {
        $this->orbis()->gateways()->delete_group($data['id']);
        $result = $this->success($data);
        return $this->emit('group.deleted', $result);
    }

    protected function onGatewayDelete($data)
    {
        $this->orbis()->gateways()->delete($data['id']);
        return $this->emit('gateway.deleted', $this->success($data));
    }

    protected function onGatewayCreate($data)
    {
        $form = $this->getServiceLocator()->get('gateways-form');
        $form->setData($data);

        if($form->isValid()) {
            $data = $form->getData();
            $gateway_name  = $data['name'];
            $gateway_group = empty($data['group']) ? null : $data['group'];

            $gateway_desc  = empty($data['description']) ? null : $data['description'];
            $x             = empty($data['x']) ? 0 : $data['x'];
            $y             = empty($data['y']) ? 0 : $data['y'];

            $result_id = $this->orbis()->gateways()->insert(
                $gateway_name, $gateway_desc,
                $x, $y, $gateway_group);

            $result = $this->fail();
            if($result_id !== false) {
                $data['id'] = $result_id;
                $data = [
                  'gateway' => $data
                ];
                $result = $this->success($data);
            }
        }
        else {
            $result = $this->fail(['errors' => $form->getMessages()]);
        }

        return $this->emit('gateway.created', $result);
    }

    */
}