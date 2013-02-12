<?php

namespace Core\Mvc\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Core\Permission\AuthService;

class IsAllowed extends AbstractPlugin
{
    protected $authService;

    public function setAuthService( AuthService $auth )
    {
        $this->authService = $auth;
        return $this;
    }

    /**
     * check that logged user is allowed to use specific $resource
     * @param $resource it should be constant from \Core\Permission\Resources class
     */
    public function __invoke( $resource = null )
    {
        if( $resource === null ) return $this->authService;

        return $this->authService->isAllowed( $resource );
    }
}