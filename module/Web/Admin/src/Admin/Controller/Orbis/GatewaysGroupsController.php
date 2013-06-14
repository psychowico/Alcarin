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
            return $this->responses()->OK();
        }
        else {
            return $this->responses()->internalServerError();
        }
    }

    public function create($group)
    {
        if(empty($group['id']) || $group['id'] == '0') {
            return $this->responses()->badRequest();
        }

        $ind = \Zend\Math\Rand::getInteger(0,10000);
        $group['id'] .= ' ' . $ind;
        $group['name'] = $group['id'];
        $gateway = [
            'name' => 'Empty gateway',
            'description' => 'Please, add description here.',
            'x' => 0,
            'y' => 0,
            'group' => $group['id'],
        ];
        $result_id = $this->orbis()->gateways()->insert(
            $gateway['name'], $gateway['description'],
            $gateway['x'], $gateway['y'], $gateway['group']);

        if($result_id !== false) {
            $gateway['id'] = $result_id;
            $group['gateways'] = [$gateway];
            return $this->json($group);
        }
        return $this->responses()->internalServerError();
    }

    protected function orbis()
    {
        return $this->gameServices()->get('orbis');
    }
}