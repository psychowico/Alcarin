<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/zf2 for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 * @package   Zend_Db
 */

namespace Core\Mapper;

use ZfcBase\Mapper\AbstractDbMapper;
use ZfcUser\Mapper\UserInterface;
use Zend\Stdlib\Hydrator\HydratorInterface;
use Zend\Db\Adapter\Adapter;
use ZfcBase\EventManager\EventProvider;
use Zend\Stdlib\Hydrator\ClassMethods;
use Zend\Db\ResultSet\HydratingResultSet;

class MongoUserMapper extends EventProvider implements UserInterface
{
    protected $tableName  = 'users';
    protected $hydrator;
    protected $mapperEntityPrototype;

    public function __construct()
    {
        $this->mapperEntityPrototype = new UserArrayMapper();
    }

    /**
     * @return HydratorInterface
     */
    private function getHydrator()
    {
        if (!$this->hydrator) {
            $this->hydrator = new ClassMethods(false);
        }
        return $this->hydrator;
    }

    private function find( $where )
    {
        if( isset( $where['_id'] ) && !$where['_id'] instanceof \MongoId ) {
            $where['_id'] = new \MongoId( $where['_id'] );
        }

        $mongo = $this->getMongoDriver();

        $result = $mongo->{$this->tableName}
                ->findOne( $where, [ 'email', 'password', 'username', 'display_name', 'privilages'] );

        if( $result == null ) return null;

        $resultSet = new HydratingResultSet( $this->getHydrator(), $this->mapperEntityPrototype );
        $resultSet->initialize( [$result] );

        $this->getEventManager()->trigger('find', $this,
                    array('entity' => new UserArrayMapper( $result ) ));

        return $resultSet->current();
    }

    public function findByEmail($email)
    {
        return $this->find( ['email' => $email] );
    }

    public function findByUsername($username)
    {
        return $this->find( ['username' => $username] );
    }

    public function findById($id)
    {
        return $this->find( ['_id' => $id ] );
    }

    public function insert($entity, $tableName = null, HydratorInterface $hydrator = null)
    {
        $mongo = $this->getMongoDriver();
        $tableName = isset( $tableName ) ? $tableName : $this->tableName;

        $arrayCopy = $entity->getArrayCopy();
        $result = $mongo->{$tableName}
                ->insert( $arrayCopy );


        $resultSet = new HydratingResultSet( $hydrator ?: $this->getHydrator(),
                                             $this->mapperEntityPrototype );
        $arrayCopy['id'] = $arrayCopy['_id'];
        unset( $arrayCopy['_id'] );

        $resultSet->initialize( [$arrayCopy] );
        return $resultSet->current();
    }

    public function update($entity, $where = null, $tableName = null, HydratorInterface $hydrator = null)
    {
        $mongo = $this->getMongoDriver();
        $tableName = isset( $tableName ) ? $tableName : $this->tableName;

        if( $where == null ) {
            $where = [ '_id' => new \MongoId( $entity->getId() ) ];
        }
        else {
            throw new \NotSupportedException( sprintf(
                'Query "$where" is not supported',
                $where
            ));
        }

        $new_object = $entity->getArrayCopy();
        unset( $new_object['_id'] );

        $result = $mongo->{$tableName}->update( $where, $new_object );
        return $result;
    }


    public function setMongoDriver($driver)
    {
        $this->mongo = $driver;
    }

    public function getMongoDriver()
    {
        return $this->mongo;
    }
}


