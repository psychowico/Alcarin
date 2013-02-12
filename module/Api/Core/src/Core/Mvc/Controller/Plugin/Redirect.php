<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/zf2 for the canonical source repository
 * @copyright Copyright (c) 2005-2013 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Core\Mvc\Controller\Plugin;


/**
 * @todo       add "toSelf" method to standard redirect plugin
 */
class Redirect extends \Zend\Mvc\Controller\Plugin\Redirect
{
    /**
     * redirect to this same site - can be useful in form posts situation, to avoid
     * page refresh browser alert.
     */
    public function toSelf()
    {
        $request = $this->getController()->getRequest();
        return $this->toUrl($request->getRequestUri());
    }
}