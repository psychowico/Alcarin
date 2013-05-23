<?php
/**
 * users administration
 */

namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Core\Permission\Resource;

class UsersController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        //for now list of all users, should have some filters and search later
        $hUsers = $this->mongo()->users->find();

        $result = array_map( function( $el ) {
            if( empty( $el['email'] ) ) return false;

            return [
                'email' => $el['email'],
                'id'    => $el['_id']->__toString()
            ];
        }, $hUsers->as_array() );
        $users = array_filter( $result, function( $el ) { return $el !== false; } );

        return [
            'users' => $users,
        ];
    }

    public function get($userid)
    {
        $hUser = $this->mongo()->users->findById($userid, ['email']);
        if( $hUser == null ) {
            return $this->redirect()->toRoute('admin/default');
        }
        $model = new \Zend\View\Model\ViewModel();
        $model->setVariables( [
            'context' => [
                'id'    => $userid,
                'email' => $hUser['email']
            ],
        ] );
        $model->setTemplate('admin/users/get');

        return $model;
    }
}
