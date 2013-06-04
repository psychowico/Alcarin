<?php

namespace Core\Mvc\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Zend\Http\Response;

/**
 * simple plugin to faster returning "bad request" response for wrong REST request.
 */
class BadRequest extends AbstractPlugin
{
    public function __invoke()
    {
        $response = new Response();
        $response->setStatusCode(Response::STATUS_CODE_400);
//         $response->getHeaders()->addHeaders(array(
//     'HeaderField1' => 'header-field-value',
//     'HeaderField2' => 'header-field-value2',
// );

        return $response;
    }
}