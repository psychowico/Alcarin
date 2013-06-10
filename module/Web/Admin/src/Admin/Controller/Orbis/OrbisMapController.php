<?php

namespace Admin\Controller\Orbis;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\Http\Header\ContentType;
use Zend\View\Model\ViewModel;

class OrbisMapController extends AbstractAlcarinRestfulController
{
    const EDIT_RANGE = 50;

    public function getInfoAction()
    {
        $properties = $this->orbis()->minimap()->properties();
        $radius = $properties->radius();
        $radius = $this->params()->fromQuery('radius', $radius);

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

        return $this->getResponse()->setContent($map_info);
    }

    protected function fetchFieldsAction()
    {
        $data = $this->params()->fromQuery();
        if(!isset($data['x']) || !isset($data['y'])) {
            return $this->responses()->badRequest();
        }

        $x = $data['x'];
        $y = $data['y'];

        $data = $this->orbis()->map()->fetchTerrainFields($x, $y, static::EDIT_RANGE);

        return $this->json([
            'size'   => 2 * static::EDIT_RANGE,
            'fields' => array_values($data),
        ]);
    }

    protected function updateFieldsAction()
    {
        $data = $this->params()->fromPost();
        $json_serialized_fields = empty($data['fields']) ? '' : $data['fields'];

        # we deserialize fields that are sending as json
        $fields = json_decode($json_serialized_fields);

        array_filter($fields, function($field) {
            return isset($field->x) && isset($field->y)
                    && isset($field->field);
        });

        $fields = array_map(function($field){
            return [
                'loc' => [
                    'x' => intval($field->x),
                    'y' => intval($field->y),
                ],
                'land' => [
                    'color' => intval($field->field->color),
                ],
            ];
        }, $fields);

        $this->orbis()->map()->upsertFields($fields);

        return $this->json(['count' => count($fields)]);
    }

    private function orbis()
    {
        return $this->gameServices()->get('orbis');
    }
}