<?php

namespace Alcarin\View\Helper;

use Zend\View\Helper\AbstractHelper;
use Core\Permission\AuthService;

class IsAllowed extends AbstractHelper
{
    protected $authService;

    public function setAuthService(AuthService $auth)
    {
        $this->authService = $auth;
        return $this;
    }

    /**
     * check that logged user is allowed to use specific $resource
     * @param $resource it should be constant from \Core\Permission\Resources class
     */
    public function __invoke($resource = null)
    {
        if( $resource === null ) return \Zend\Debug\Debug::dump($this->getView());


        if( is_string($resource) ) {
            $r_resource = constant('Core\\Permission\\Resource::' . $resource);
            if( $r_resource == null ) {
                throw new \DomainException(sprintf('"%s" is not a valid resource name.', $resource ));
            }
            $resource = $r_resource;
        }
        return $this->authService->isAllowed( $resource );
    }
}