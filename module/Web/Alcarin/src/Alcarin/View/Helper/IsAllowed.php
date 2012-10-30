<?php

namespace Alcarin\View\Helper;

use Zend\View\Helper\AbstractHelper;
use Core\Permission\AuthService;

class IsAllowed extends AbstractHelper
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