<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace ZDTPack\Controller;

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

}
