<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace DevPack\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\Console\Request as ConsoleRequest;

class DevActionsController extends AbstractAlcarinRestfulController
{
    public function fetchTimeAction()
    {
        $time = $this->gameServices()->get('time');
        return $this->json([
            'freezed' => $time->isFreezed(),
            'hour'    => $time->hour(),
            'min'     => $time->min(),
            'sec'     => $time->sec(),
        ]);
    }

    public function toggleTimeAction()
    {
        $time = $this->gameServices()->get('time');
        if($time->isFreezed()) {
            $time->unfreeze();
        }
        else {
            $time->freeze();
        }
        return $this->fetchTimeAction();
    }
}
