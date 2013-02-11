<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Admin\Controller\Users;

use Core\Controller\AbstractAlcarinRestfulController;
use Core\Permission\Resource;

class PrivilagesController extends AbstractAlcarinRestfulController
{
    public function get($userid)
    {
        $user_admin = $this->getServiceLocator()->get('user-admin');

        $user_privilages = [];
        foreach( Resource::$Descriptions as $group => $privilages ) {
            $user_privilages[ $group ] = [];
            foreach( $privilages as $resource => $privDescr ) {
                $user_privilages[ $group ] []= [
                    'id'         => $resource,
                    'name'        => $privDescr[0],
                    'description' => $privDescr[1],
                    'has'         => $user_admin->userHasAccessTo( $userid, $resource )
                ];
            }
        }

        return ['resources_group' => $user_privilages];
    }

    public function update($userid, $set)
    {
        if( !empty( $set['group'] ) ) {
            $group = $set['group'];
            if( !empty( Resource::$Descriptions[$group] ) ) {
                $resources = empty( $set['resource'] ) ? [] : $set['resource'];
                $user_admin = $this->getServiceLocator()->get('user-admin');

                $changed_resources = [];
                foreach( Resource::$Descriptions[$group] as $resource => $privDesc ) {
                    $changed_resources[$resource] = in_array($resource, $resources);
                }
                $user_admin->updateUserPrivilages($userid, $changed_resources);
            }
        }
        return $this->get($userid);

    }
}
