<?php

namespace Admin\GameObject\Extension;

class OrbisGateways extends \Core\GameObject
{
    public function find($grouped = true)
    {
        $gateways = $this->mongo()->{'map.gateways'}->find();
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

    public function insert($gateway_name, $group = null)
    {
        return $this->mongo()->{'map.gateways'}->insert([
            'name'  => $gateway_name,
            'group' => $group
        ]);
    }
}