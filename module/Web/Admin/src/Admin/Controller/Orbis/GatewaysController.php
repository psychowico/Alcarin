<?php

namespace Admin\Controller\Orbis;

use Core\Controller\AbstractEventController;

class GatewaysController extends AbstractEventController
{
    protected function onGatewaysFetch()
    {
        $grouped_gateways = $this->orbis()->gateways()->find();
        foreach($grouped_gateways as $key => $group) {
            $grouped_gateways[$key] = array_map( function($gateway) {
                $gateway['id'] = $gateway['_id']->{'$id'};
                unset($gateway['_id']);
                return $gateway;
            }, $group );
        }

        $response = $this->success(['gateways' => $grouped_gateways]);
        return $this->emit('gateways.all', $response );
    }

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

    protected function onGatewayUpdate($data)
    {
        $form = $this->getServiceLocator()->get('gateways-form');
        $form->setData($data);

        if($form->isValid()) {
            $new_data = $form->getData();

            $this->orbis()->gateways()->update($new_data['id'],
                $new_data['name'], $new_data['description'],
                $new_data['x'], $new_data['y'], $new_data['group'] );
            $result = $this->success(['gateway' => $new_data]);
        }
        else {
            $result = $this->fail(['errors' => $form->getMessages()]);
        }

        return $this->emit('gateway.updated', $result);
    }

    protected function orbis()
    {
        return $this->gameServices()->get('orbis');
    }
}