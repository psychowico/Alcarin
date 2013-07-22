<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace DevPack\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Console\Request as ConsoleRequest;

class DevConsoleController extends AbstractActionController
{
    public function createSuAction()
    {
        $messages = [];

        $request = $this->getRequest();
        // Make sure that we are running in a console and the user has not tricked our
        // application into running this action from a public web server.
        if (!$request instanceof ConsoleRequest){
            throw new \RuntimeException('You can only use this action from a console!');
        }

        $email = $request->getParam('suemail');
        $pass  = $request->getParam('supass');

        $service = $this->getServiceLocator()->get('zfcuser_user_service');
        $result = $service->register([
            'email'          => $email,
            'password'       => $pass,
            'passwordVerify' => $pass,
        ]);

        if( $result === false) {
            $messages []= 'Error:';
            $_messages = $service->getRegisterForm()->getMessages();
            unset( $_messages['passwordVerify']);
            foreach( $_messages as $field => $msgs ) {
                $messages []= sprintf(' Field "%s":', $field);
                foreach( $msgs as $msg ) {
                    $messages []= "\t$msg";
                }
            }
        }
        else {
            $users = $this->getServiceLocator()->get('mongo')->users;
            $max = pow(2, \Core\Permission\Resource::RESOURCE_LIMIT) - 1;
            $users->update_safe(['email' => $email], ['$set' => ['privilages' => new \MongoInt64($max)]] );

            $messages []= sprintf('Super User "%s" with password "%s" created successufuly.', $email, $pass);
        }


        return implode( "\n", $messages ) . PHP_EOL;
    }

    public function prepareDatabaseAction()
    {
        $messages = [];
        $request = $this->getRequest();
        // Make sure that we are running in a console and the user has not tricked our
        // application into running this action from a public web server.
        if (!$request instanceof ConsoleRequest){
            throw new \RuntimeException('You can only use this action from a console!');
        }
        $mongo = $this->getServiceLocator()->get('mongo');

        $game_services = $this->getServiceLocator()->get('game-services');
        $radius = $game_services->get('orbis')->map()->properties()->radius();

        //geo indexes
        $geo_collections = ['map', 'map.chars', 'map.gateways'];
        foreach($geo_collections as $collection) {
            $mongo->command( ['deleteIndexes' => $collection, 'index' => 'geo_world_index']);
            $mongo->{$collection}->ensureIndex(['loc' => '2d'], ['name'=> 'geo_world_index', 'min' => -$radius, 'max' => $radius]);

            echo 'Done indexing "' . $collection . '" collection.' . PHP_EOL;
        }

        //char events index (time and char id)
        $mongo->command( ['deleteIndexes' => 'map.chars.events', 'index' => 'chars_time']);
            $mongo->{'map.chars.events'}->ensureIndex(['char' => 1, 'time' => -1], ['name'=> 'chars_time']);
        echo 'Done indexing "map.chars.events" collection.' . PHP_EOL;

        $this->initTranslationsAction();
        echo 'Done setting default translations pack.' . PHP_EOL;
    }

    public function initTranslationsAction()
    {
        $mongo = $this->getServiceLocator()->get('mongo');

        $filepath = realpath('./config/default-translations.json');
        $json_string = file_get_contents($filepath);
        $data = json_decode($json_string, true);
        foreach($data as $lang => $pack) {
            foreach($pack as $key => $value) {
                $fullkey = $key . '.' . $lang;
                $mongo->translations->insert([
                    '_id' => $fullkey,
                    'val' => $value,
                ]);
            }
        }

    }
}
