<?php

namespace Admin\GameObject\Extension;

class OrbisGateways extends \Core\GameObject
{
    const COLLECTION = 'map.gateways';

    public function find($grouped = true)
    {
        $gateways = $this->mongo()->{static::COLLECTION}->find()->sort(['name'=> 1]);
        if($grouped) {
            $gateways = $gateways->toArray();
            $grouped_gateways = [];
            foreach($gateways as $gateway) {
                $_group = empty($gateway['group']) ? 0 : $gateway['group'];
                if(empty($grouped_gateways[$_group])) {
                    $grouped_gateways[$_group] = [];
                }
                $grouped_gateways[$_group] []= $gateway;
            }
            $gateways = $grouped_gateways;
        }

        return $gateways;
    }

    public function rename_group($old_name, $new_name)
    {
        $all = $this->find();

        if(empty($all[$old_name])) {
            return "Can not find group '$old_name'.";
        }
        if(!empty($all[$new_name])) {
            return "Group with name '$new_name' exists.";
        }

        foreach($all[$old_name] as $gateway) {
            $gateway['group'] = $new_name;
            $this->mongo()->{static::COLLECTION}->updateById($gateway['_id'], $gateway);
        }

        return true;
    }

    public function delete_group($group_name)
    {
        $all = $this->find();

        if(empty($all[$group_name])) return false;

        foreach($all[$group_name] as $gateway) {
            $gateway['group'] = 0;
            $this->mongo()->{static::COLLECTION}->updateById($gateway['_id'], $gateway);
        }

        return true;
    }

    public function update($id, $gateway_data)
    {
        return $this->mongo()->{static::COLLECTION}->updateById($id, $gateway_data);
    }

    public function insert($gateway_name, $group = null)
    {
        return $this->mongo()->{static::COLLECTION}->insert([
            'name'  => $gateway_name,
            'group' => $group
        ]);
    }
}