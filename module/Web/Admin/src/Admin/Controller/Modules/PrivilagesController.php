<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Admin\Controller\Modules;

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
        // Pass in the route/url you want to redirect to after the POST

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

                    $players = $this->gameServices()->get('players');
                    $player_priv = $players->get($userid)->admin()->privilages();

                    $player_priv->update($changed_resources);

                    $this->log()->info('User "%s" privilages updated.', $userid);
                    $uri = $this->getRequest()->getRequestUri();
                }
                else {
                    \Zend\Debug\Debug::dump($form->getMessages());exit;

                    $this->log()->warn('Can not save privilages form.');
                }
            }
        }
        return $this->redirect()->toSelf();
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
        $builder = new \Core\Service\AnnotationBuilderService();

        $privilages_forms = [];

        $players = $this->gameServices()->get('players');
        $player_priv = $players->get($userid)->admin()->privilages();

        foreach( Resource::$Descriptions as $group => $privilages ) {
            $form = $builder->createForm( new PrivilagesGroupForm(), 'Confirm' );
            $form->setName('privilages-' . strtolower($group));

            $content = $form;
            $content->setLabel($group);

            $content->get('group')->setValue($group);

            $options = [];
            $checked_values = [];
            foreach( $privilages as $resource => $privDescr ) {
                $options [$resource] =  $privDescr[1];

                if( $player_priv->hasAccessTo($resource) ) {
                    $checked_values []= $resource;
                }
            }

            $content->get('resource')->setValueOptions( $options )
                 ->setValue($checked_values);

            $privilages_forms [$group]= $form;
        }



        return $privilages_forms;
    }
}
