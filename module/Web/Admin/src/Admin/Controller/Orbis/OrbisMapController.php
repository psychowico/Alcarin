<?php

namespace Admin\Controller\Orbis;

use Core\Controller\AbstractEventController;
use Zend\Http\Header\ContentType;
use Zend\View\Model\ViewModel;

class OrbisMapController extends AbstractEventController
{
    const EDIT_RANGE = 50;

    protected function onGetInfo($data)
    {
        $tmp = !empty($data['radius']);
        if($tmp) {
            $radius = $data['radius'];
        }
        else {
            $properties = $this->orbis()->minimap()->properties();
            $radius = $properties->radius();
        }

        $radius_km = $radius / 10;

        $area = number_format( pi() * $radius * $radius );
        $area_km = number_format( pi() * $radius_km * $radius_km );

        //I assume that man can move 50km at day
        $travel_time_days = ($radius_km / 50);

        $htmlViewPart = new ViewModel([
            'radius' => $radius,
            'radius_km' => $radius_km,
            'area'  => $area,
            'area_km' => $area_km,
            'travel_time' => $travel_time_days,
            'travel_time_real' => 4 * $travel_time_days,
            'travel_time_real_months' => (4 * $travel_time_days / 30),
        ]);

        $htmlViewPart->setTemplate('admin/orbis/map-info');
        $map_info =  $this->getServiceLocator()
                     ->get('zfctwigrenderer')
                     ->render($htmlViewPart);

        $response = $this->success(['info'=> $map_info]);

        return $this->emit( $tmp ? 'tmp-map-info.generated' :
            'map-info.generated', $response);
    }

    protected function onFieldsFetch($data)
    {
        if(!isset($data['x']) || !isset($data['y'])) {
            return $this->emit('fields.loaded', $this->fail());
        }

        $x = $data['x'];
        $y = $data['y'];

        $data = $this->orbis()->map()->fetchTerrainFields($x, $y, static::EDIT_RANGE);
        // $data = array_map( function($field) {
        //     # decode integer colors
        //     $hex = dechex($field['land']['color']);
        //     $field['land']['color'] = "#" . substr("000000" . $hex, -6);
        //     return $field;
        // }, $data);
        $result = $this->success([
            'size'   => 2 * static::EDIT_RANGE,
            'fields' => array_values($data)
        ]);
        return $this->emit('fields.loaded', $result);
    }

    private function orbis()
    {
        return $this->gameServices()->get('orbis');
    }
}