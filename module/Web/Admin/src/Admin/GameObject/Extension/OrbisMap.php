<?php

namespace Admin\GameObject\Extension;

class OrbisMap extends \Core\GameObject
{
    public function fetchTerrainFields($center_x, $center_y, $range)
    {
        # typical mongo geo-2d query
        return $this->mongo()->map->find([
            'loc' => [
                '$within'        => [
                    '$box' => [
                        [$center_x - $range, $center_y - $range],
                        [$center_x + $range - 1, $center_y + $range - 1],
                    ]
                ],
            ],
            # only fields with information about territory ("land")
            'land' => [ '$exists' => 1],
        ])->fields(['land' => 1, 'loc' => 1])->toArray();
    }
}