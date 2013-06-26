<?php

/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/zf2 for the canonical source repository
 * @copyright Copyright (c) 2005-2013 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Core\Session\SaveHandler;

use Zend\Session\SaveHandler\MongoDB;
use Zend\Session\SaveHandler\MongoDBOptions;
use Zend\Session\Exception\InvalidArgumentException;
use Mongo;
use MongoId;
use MongoDate;

/**
 * MongoDB session save handler
 */
class MongoDBExt extends MongoDB
{
    use \Core\Service\GameServiceAwareTrait;

    public function __construct($mongo, MongoDBOptions $options)
    {
        if (null === ($database = $options->getDatabase())) {
            throw new InvalidArgumentException('The database option cannot be emtpy');
        }

        if (null === ($collection = $options->getCollection())) {
            throw new InvalidArgumentException('The collection option cannot be emtpy');
        }

        $this->mongoCollection = $mongo->selectCollection($database, $collection);
        $this->options = $options;
    }

    /**
     * Write session data
     *
     * @param string $id
     * @param string $data
     * @return bool
     */
    public function write($id, $data)
    {
        $saveOptions = array_replace(
            $this->options->getSaveOptions(),
            array('upsert' => true, 'multiple' => false)
        );

        $criteria = array(
            '_id' => $id,
            $this->options->getNameField() => $this->sessionName,
        );

        $player = $this->getServicesContainer()->get('players')->current();

        $newObj = array('$set' => array(
            $this->options->getDataField() => (string) $data,
            $this->options->getLifetimeField() => $this->lifetime,
            $this->options->getModifiedField() => new MongoDate(),
            'player' => $player == null ? null : new MongoId($player->id()),
        ));

        /* Note: a MongoCursorException will be thrown if a record with this ID
         * already exists with a different session name, since the upsert query
         * cannot insert a new document with the same ID and new session name.
         * This should only happen if ID's are not unique or if the session name
         * is altered mid-process.
         */
        $result = $this->mongoCollection->update($criteria, $newObj, $saveOptions);

        return (bool) (isset($result['ok']) ? $result['ok'] : $result);
    }
}