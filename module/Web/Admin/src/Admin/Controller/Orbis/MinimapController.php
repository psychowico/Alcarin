<?php
/**
 * users administration
 */

namespace Admin\Controller\Orbis;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\Http\Header\ContentType;

class MinimapController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        /** @var $response \Zend\Http\PhpEnvironment\Response */

        $minimap = $this->gameServices()->get('orbis')->minimap();
        if(!$minimap->exists()) $minimap->recreate();

        $response = $this->getResponse();

        $header = ContentType::fromString( 'Content-type: image/jpeg' );
        $response->getHeaders()->addHeader( $header );
        $response->setContent( $minimap->fileGetContents() );

        return $response;
    }
}