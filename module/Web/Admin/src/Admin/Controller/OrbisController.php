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

    private function mapInfo()
    {
        $orbis = $this->gameServices()->get('orbis');
        $properties = $orbis->minimap()->properties();

        $radius = $properties->radius();
        $radius_km = $radius / 10;

        $area = number_format( pi() * $radius * $radius );
        $area_km = number_format( pi() * $radius_km * $radius_km );

        //I assume that man can move 50km at day
        $travel_time_days = ($radius_km / 50);

        return sprintf( <<<MAP
<h4>Basics</h4>
<p>One terrain unit (<b>u</b>) is equal to 100 m / 100 m square.</p>
<p>One game day (<b>g.d.</b>) is equal to four real time days.</p>
<h4>Sizes</h4>
<p>
<div>Game world radius: <i>%s <b>u</b> (%s <b>km</b>)</i></div>
<div>Game world area: <i>%s <b>u²</b> (%s <b>km²</b>)</i></div>
</p>
<h4>Traveling</h4>
<p>
<div><b>Theoretical travel time</b> is a time that a avarage person need to travel world radius -
on foot, by using best existing road type and without any breaks for food, fight or
anything.</div>
<b>Theoretical travel time</b>: <i>%s <b>g.d.</b> (%s days - mean %.1f months)</i></div>
</p>
MAP
        , $radius, $radius_km, $area, $area_km
        , $travel_time_days, 4 * $travel_time_days, (4 * $travel_time_days / 30) );
    }

}