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

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        /*$mongo = $this->getServiceLocator()->get('mongo');

        $x= array();
        $i =0;

        $collection = $mongo->testing->limit(10000);
        foreach( $collection as $c ) {

        }*/

        return [ 'version' => \Zend\Version\Version::VERSION ];
    }
}
