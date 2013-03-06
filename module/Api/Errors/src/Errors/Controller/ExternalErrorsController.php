<?php

namespace Errors\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\View\Model\ViewModel;

use Zend\InputFilter\InputFilter;

/**
 * manager external errors, probably only for debug purposes, when game will be in beta,
 * it can log players JAVASCRIPT errors from most browsers for sample.
 * it saving incoming errors in "logs.js" and storing requests callers ips
 * in "logs.js.limit" table, to make requests limit per day
 * ( to ExternalErrorsController::LOGS_DAY_LIMIT_PER_IP )
 */
class ExternalErrorsController extends AbstractAlcarinRestfulController
{
    const LOGS_DAY_LIMIT_PER_IP = 5;

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
                'allow_empty' => true,
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

    public function create($data)
    {
        if( $this->aboveDayLimit() ) return $this->json()->fail();

        $mode = empty($data['mode']) ? 'auto' : $data['mode'];

        if($mode == 'auto') {
            return $this->autoJsError($data);
        }
        else {
            return $this->manualJsError($data);
        }
    }

    private function autoJsError($data)
    {
        $inputFilter = $this->errorInputFilter();
        $inputFilter->setData( $data );
        if( $inputFilter->isValid() ) {
            $data = $inputFilter->getValues();

            //store additional information about user
            $data = $this->addErrorSourceInfo($data);

            $this->mongo()->{'logs.js'}->insert( $data );
            $this->updateLogsLimit();

            return $this->json()->success();
        }
        return $this->json()->fail();
    }

    private function manualJsError($data)
    {
        if(empty($data['stack']) || empty($data['msg']) ) return $this->json()->fail();

        $data = [ 'stack' => $data['stack'], 'msg' => $data['msg'], 'mode'=> 'manual' ];
        $data = $this->addErrorSourceInfo($data);

        $this->mongo()->{'logs.js'}->insert( $data );
        $this->updateLogsLimit();

        return $this->json()->success();
    }

    private function addErrorSourceInfo($data)
    {
        $data['ip'] = $this->getRequest()->getServer('REMOTE_ADDR');
        $auth    = $this->getServiceLocator()->get('zfcuser_auth_service');
        if( $auth->hasIdentity() ) {
            $user_id = new \MongoId( $auth->getIdentity()->getId() );
            $data['user-id'] = \MongoDBRef::create( 'users', $user_id );
        }
        return $data;
    }

    private function aboveDayLimit()
    {
        $user_ip = $this->getRequest()->getServer('REMOTE_ADDR');

        $limitQ = $this->mongo()->{'logs.js.limit'}->findOne( ['ip' => $user_ip ] );
        if( $limitQ == null ) {
            $limit = 0;
        }
        else {
            $limit = isset( $limitQ['count'] ) ? $limitQ['count'] : 0;
            if( $limit > 0 && $limitQ['last_time'] instanceof \MongoDate ) {
                $time = $limitQ['last_time']->sec;
                if( (time() - $time) > ( 60 * 60 * 24 ) ) {
                    //old limit, can be ommited
                    $limit = 0;
                }
            }
        }

        return ( $limit >= static::LOGS_DAY_LIMIT_PER_IP );
    }

    private function updateLogsLimit()
    {
        $ip = $this->getRequest()->getServer('REMOTE_ADDR');
        $this->mongo()->{'logs.js.limit'}->update( ['ip' => $ip],
                ['last_time' => new \MongoDate(), '$inc' => ['count' => 1] ],
                ['upsert' => true] );
    }
}
