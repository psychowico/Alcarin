<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Errors\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\ViewModel;

use Zend\InputFilter\InputFilter;

/**
 * manager external errors, probably only for debug purposes, when game will be in beta,
 * it can log players JAVASCRIPT errors from most browsers for sample.
 */
class ExternalErrorsController extends AbstractRestfulController
{
    public function getList()
    {
        return ['getlist'=>321];
    }

    public function get( $id )
    {
        return ['get'=>321];
    }

    public function update( $id, $data )
    {
        return ['update'=>321];
    }

    public function delete( $id )
    {
        return ['delte'=>321];
    }

    private function errorInputFilter()
    {
        $inputFilter = new InputFilter();

        $filters = [
            [
                'name'     => 'line',
                'filters'  => [ ['name' => 'Int'] ],
            ],
            [
                'name'     => 'msg',
                'filters'  => [
                    ['name' => 'StripTags'],
                    ['name' => 'StringTrim'],
                ],
                'validators' => [ [
                        'name'    => 'StringLength',
                        'options' => [
                            'encoding' => 'UTF-8',
                            'min'      => 1,
                            'max'      => 250,
                        ],
                ]],
            ],
            [
                'name'     => 'url',
                'filters'  => [
                    ['name' => 'StripTags'],
                    ['name' => 'StringTrim'],
                ],
                'validators' => [
                    [
                        'name'    => 'StringLength',
                        'options' => [
                            'encoding' => 'UTF-8',
                            'min'      => 5,
                            'max'      => 100,
                        ],
                    ],
                ],
            ]
        ];

        foreach( $filters as $filter ) {
            $inputFilter->add( $filter );
        }

        return $inputFilter;
    }

    public function create( $data )
    {
        $inputFilter = $this->errorInputFilter();
        $inputFilter->setData( $data );
        if( $inputFilter->isValid() ) {
            $data = $inputFilter->getValues();

            $user_ip = $this->getRequest()->getServer('REMOTE_ADDR');
            $data['user-ip'] = $user_ip;

            $auth    = $this->getServiceLocator()->get('zfcuser_auth_service');
            if( $auth->hasIdentity() ) {
                $data['user-id'] = \MongoDBRef::create( 'users',
                                new \MongoId( $auth->getIdentity()->getId() ) );
            }

            //need additional validation - 5 per day per ip

            $mongo = $this->getServiceLocator()->get('mongo');
            $result = $mongo->ext_logs->insert( $data );

            return ['ok' => 1];
        }
        return ['ok' => 0];
    }
}
