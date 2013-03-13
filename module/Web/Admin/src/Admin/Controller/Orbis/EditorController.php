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
        return [];
    }


    private function orbis()
    {
        return $this->gameServices()->get('orbis');
    }
}