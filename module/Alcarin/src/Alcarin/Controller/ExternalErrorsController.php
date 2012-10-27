<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Alcarin\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\ViewModel;


class ExternalErrorsController extends AbstractRestfulController
{
    public function getList()
    {
        return [];
    }

    public function get( $id )
    {
        return [];
    }

    public function update( $id, $data )
    {
        return [];
    }

    public function delete( $id )
    {
        return [];
    }

    public function create( $data )
    {
        $user_ip = $this->getRequest()->getServer('REMOTE_ADDR');
        $data['user-ip'] = $user_ip;

        //let us 'ok' instead of 'success' flag everywhere, we make it less writing
        //and less data to send
        /*return new \Zend\View\Model\JsonModel( ['ok' => 1] );*/
        return $data;
    }
}
