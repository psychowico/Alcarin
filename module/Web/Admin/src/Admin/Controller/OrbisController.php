<?php
/**
 * users administration
 */

namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\View\Model\ViewModel;

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

    public function get($id)
    {
        $args = explode(',', $id);
        if(count($args) >= 2) {
            list($x, $y) = $args;
            $x = floatval($x);
            $y = floatval($y);
            $range = empty($args[2]) ? null : $args[2];
            if($this->isJson()) {
                return $this->json()->success([
                    'map' => $this->getMapAtRange($x, $y, $range)
                ]);
            }

            $map = $this->orbis()->minimap();
            $radius = $map->properties()->radius();
            if($x <= $radius && $y <= $radius ) {
                $model = new ViewModel([
                    'x' => $x,
                    'y' => $y,
                    'range' => $range
                ]);
                return $model->setTemplate('admin/orbis/orbis/editor');
            }
        }

        return $this->redirect()->toParent();
    }

    private function orbis()
    {
        return $this->gameServices()->get('orbis');
    }

    private function getMapAtRange($x, $y, $range = null)
    {
        return ['test'];

    }

    private function mapInfo()
    {
        $properties = $this->orbis()->minimap()->properties();

        $radius = $properties->radius();
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
        return $this->getServiceLocator()
                     ->get('zfctwigrenderer')
                     ->render($htmlViewPart);
    }
}