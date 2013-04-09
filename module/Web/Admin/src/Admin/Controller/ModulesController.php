<?php
/**
 * users administration
 */

namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Core\Permission\Resource;

class ModulesController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        $service_manager = $this->getServiceLocator();
        $game_modules_info = $service_manager->get('config')['game-modules'];
        $modules = array_map( function($el){
            if( empty( $el['game-objects-ext'] ) )
                return [
                    'description' => $el['description']
                ];


            return [
                'description' => $el['description'],
                'game-objects-ext' => $el['game-objects-ext']
            ];
        }, $game_modules_info );
        return ['modules' => $modules]; 

    }
    public function get($moduleName)
    {

        $service_manager = $this->getServiceLocator();
        $game_modules_info = $service_manager->get('config')['game-modules'];
        $module = $game_modules_info[$moduleName];

        $model = new \Zend\View\Model\ViewModel();
        $model -> setTemplate('admin/modules/get');
        $model -> setVariables( [
           'module' => [
                'name'             => $moduleName,
                'description'      => $module['description'],
                'game-objects-ext' => isset( $module['game-objects-ext'] )  ? $module['game-objects-ext'] : []
            ],
        ] );




        return $model;

    }
    /*public function get($moduleName)
    {
        return null;
        $service_manager = $this->getServiceLocator();
        $game_modules_info = $service_manager->get('config')['game-modules'];
        \Zend\Debug\Debug::dump($game_modules_info($moduleName));
        return $game_modules_info($moduleName);

        //return null;
        //return ['modules' => null]; 
    }*/
}
