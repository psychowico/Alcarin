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
use Admin\Form\PrivilagesGroupForm;
use Zend\Form\Annotation\AnnotationBuilder;

class PrivilagesController extends AbstractAlcarinRestfulController
{
    protected $user_admin;

    public function get($userid)
    {
        return ['forms' => $this->preparePrivilagesForms($userid)];
    }

    public function update($userid, $set)
    {
        if( !empty( $set['group'] ) ) {
            $group = $set['group'];
            $forms = $this->preparePrivilagesForms($userid);
            if( !empty($forms[$group]) ) {
                $form = $forms[$group];
                $form->setData($set);

                if( $form->isValid() ) {
                    $resources = $form->getData()['resource'];
                    $resources = $resources ?: [];

                    $changed_resources = [];
                    foreach( Resource::$Descriptions[$group] as $resource => $privDesc ) {
                        $changed_resources[$resource] = in_array($resource, $resources);
                    }
                    $this->userAdmin()->updateUserPrivilages($userid, $changed_resources);

                    $this->log()->info('User "%s" privilages updated.', $userid);
                }
            }
        }
        return $this->get($userid);
    }

    protected function userAdmin()
    {
        if( $this->user_admin == null ) {
            $this->user_admin = $this->getServiceLocator()->get('user-admin');
        }
        return $this->user_admin;
    }

    private function preparePrivilagesForms($userid)
    {
        $builder = $this->getServiceLocator()->get('form-builder');
        $user_admin = $this->userAdmin();

        $privilages_forms = [];
        foreach( Resource::$Descriptions as $group => $privilages ) {
            $form = $builder->createForm( new PrivilagesGroupForm() );
            $form->setName('privilages-' . strtolower($group))
                 ->setLabel($group);

            $form->get('group')->setValue($group);

            $options = [];
            $checked_values = [];
            foreach( $privilages as $resource => $privDescr ) {
                $options [$resource] =  $privDescr[1];
                if( $user_admin->userHasAccessTo($userid, $resource) ){
                    $checked_values []= $resource;
                }
            }

            $form->get('resource')->setValueOptions( $options )
                 ->setValue($checked_values);

            $privilages_forms [$group]= $form;
        }



        return $privilages_forms;
    }
}
