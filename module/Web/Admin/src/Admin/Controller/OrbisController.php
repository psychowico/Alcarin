<?php
/**
 * users administration
 */

namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;

class OrbisController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        if($this->isJson()) {
            $info = $this->mapInfo();
            return $this->json()->success(['info' => $info]);
        }
        return [
            'gateway_form' => $this->getServiceLocator()->get('gateways-form')
        ];
    }

    public function mapInfo()
    {
        $orbis = $this->gameServices()->get('orbis');
        $properties = $orbis->minimap()->properties();

        $radius = $properties->radius();
        $radius_km = $radius / 10;

        $area = number_format( pi() * $radius * $radius );
        $area_km = number_format( pi() * $radius_km * $radius_km );

        //I assume that man can move 50km at day
        $travel_time_days = ($radius_km / 50);

        $htmlViewPart = new \Zend\View\Model\ViewModel([
            'radius' => $radius,
            'radius_km' => $radius_km,
            'area'  => $area,
            'area_km' => $area_km,
            'travel_time' => $travel_time_days,
            'travel_time_real' => 4 * $travel_time_days,
            'travel_time_real_months' => (4 * $travel_time_days / 30),
        ]);

        $htmlViewPart->setTemplate('admin/orbis/map-info');
        return $this->getServiceLocator()
                     ->get('zfctwigrenderer')
                     ->render($htmlViewPart);
    }
}