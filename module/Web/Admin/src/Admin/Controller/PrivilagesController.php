<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Core\Permission\Resource;

class PrivilagesController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        //$authService = $this->getServiceLocator()->get('auth-service');
        return [ 'resources_group' => Resource::$Descriptions ];
    }
}
