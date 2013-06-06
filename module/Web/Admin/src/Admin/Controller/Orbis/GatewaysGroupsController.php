<?php

namespace Admin\Controller\Orbis;

use Core\Controller\AbstractAlcarinRestfulController;

class GatewaysGroupsController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        $fullmode = $this->params()->fromQuery('full', false);
        if($fullmode){
            $gateways_data = $this->orbis()->gateways()->find();
            $grouped_gateways = [];
            foreach($gateways_data as $key => $group) {
                $grouped_gateways []= [
                    'id'   => strval($key),
                    'name' => strval($key),
                    'gateways' => array_map( function($gateway) {
                        $gateway['id'] = $gateway['_id']->{'$id'};
                        unset($gateway['_id']);
                        return $gateway;
                    }, $group ),
                ];
            }

            return $this->json($grouped_gateways);
        }
        else {
            $groups = $this->orbis()->gateways()->fetchGroups();
            $groups = array_map( function($name) {
                return [
                    'name' => $name,
                ];
            }, $groups);
            return $this->json($groups);
        }
    }

    public function update($group_id, $data)
    {
        if(empty($data['name']) or $data['name'] == "0") return $this->responses()->badRequest();

        $this->orbis()->gateways()->rename_group($group_id, $data['name']);

        $data['id'] = $data['name'];
        return $this->json($data);
    }

    public function delete($id)
    {
        if($this->orbis()->gateways()->delete_group($id)) {
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

    */
}