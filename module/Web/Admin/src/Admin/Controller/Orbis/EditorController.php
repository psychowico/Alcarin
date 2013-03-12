<?php
/**
 * users administration
 */

namespace Admin\Controller\Orbis;

use Core\Controller\AbstractAlcarinRestfulController;

class EditorController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        return $this->redirect()->toParent();
    }


    public function get($id)
    {
        $args = explode(',', $id);

        if(count($args) == 2) {
            list($x, $y) = $args;
            $x = floatval($x);
            $y = floatval($y);
        }
        else {
            $x = $y = 0;
        }
        $map = $this->orbis()->minimap();

        $radius = $map->properties()->radius();
        if($x * $x + $y * $y <= $radius * $radius) {
            return [
                'x' => $x,
                'y' => $y,
            ];
        }

        return $this->redirect()->toParent();
    }

    private function orbis()
    {
        return $this->gameServices()->get('orbis');
    }
}