<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Alcarin\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Core\Permission\Resource;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        $this->gameServices('mongo-log-writer', function( $gm ) {
            return new \Core\Log\Writer\MongoWriter();
        });
        $sl = $this->getServiceLocator();
        $gameServices = $this->gameServices();

        $start = microtime(true);


        for ($i=0; $i < 5; $i++) {
            $m = $gameServices->get2('mongo-log-writer');
            /*$sl->get('mongo-log-writer');*/
        }



        \Zend\Debug\Debug::dump( 1000*(microtime(true) - $start) );


        return [ 'version' => \Zend\Version\Version::VERSION ];
    }
}
